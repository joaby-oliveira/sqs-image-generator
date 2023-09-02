import { createWriteStream } from 'fs';
import request from 'request';

import { SQS, config } from 'aws-sdk';

import cron from 'node-cron';

import { Server } from 'socket.io';

const io = new Server(3001, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

config.update({ region: 'us-east-1' });

const sqs = new SQS();

const generateImage = (fileName: string) => {
  fileName = fileName + '.png';
  request('https://cataas.com/cat').pipe(
    createWriteStream('images/' + fileName)
  );
  return { fileName };
};

async function getQueueMessagesQty() {
  return sqs
    .getQueueAttributes(
      {
        QueueUrl:
          'https://sqs.us-east-2.amazonaws.com/508248337843/image-generator',
        AttributeNames: ['ApproximateNumberOfMessages'],
      },
      (err, data) => {
        if (err) {
          return console.log(err);
        }
      }
    )
    .promise();
}

async function receiveMessages() {
  const generatedImages = [];

  await sqs
    .receiveMessage(
      {
        MaxNumberOfMessages: 10,
        QueueUrl:
          'https://sqs.us-east-2.amazonaws.com/508248337843/image-generator',
        WaitTimeSeconds: 1,
      },
      (err, data) => {
        if (err) {
          return console.log(err);
        } else if (data.Messages) {
          data.Messages.forEach(({ MessageId, ReceiptHandle }) => {
            const { fileName } = generateImage(MessageId);
            generatedImages.push(fileName);
            sqs.deleteMessage(
              {
                QueueUrl:
                  'https://sqs.us-east-2.amazonaws.com/508248337843/image-generator',
                ReceiptHandle,
              },
              (erro, data) => {
                if (erro) {
                  return console.log(erro);
                }
                console.log('Message deleted: ', data);
              }
            );
          });
        }
      }
    )
    .promise();
  io.emit('images-generated', generatedImages);
}

cron.schedule('*/5 * * * * *', () => receiveMessages());
