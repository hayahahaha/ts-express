import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.send({
    hostname: req.hostname,
    path: req.path,
    method: req.method,
  });
})

router.post('/', (req, res) => {
  return res.send(req.body)
})

export default router;