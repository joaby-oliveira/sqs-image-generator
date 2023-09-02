import express from 'express';
import cors from 'cors';
import { SQS, config } from 'aws-sdk';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

config.update({ region: 'sa-east-1' });

const sqs = new SQS();

app.post('/solicitar-imagens', (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: 'O corpo da solicitação não pode ser vazio',
    });
  }
  if (!req.body.imageQuantity || req.body.imageQuantity < 1) {
    return res.status(400).json({
      message: 'A quantidade de imagens precisa ser informada corretamente',
    });
  }

  const imageQuantity = req.body.imageQuantity;

  for (let i = 0; i < imageQuantity; i++) {
    sqs.sendMessage(
      {
        MessageBody: 'image-generator',
        QueueUrl:
          'https://sqs.us-east-2.amazonaws.com/508248337843/image-generator',
      },
      (err, data) => {
        if (err) {
          console.log('Erro', err);
        } else {
          console.log('Mensagem enviada com sucesso', data.MessageId);
        }
      }
    );
  }
  res.json({ message: 'Solicitação enviada com sucesso' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
