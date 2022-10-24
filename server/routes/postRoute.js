import express from 'express'
import { getAllPosts, createPost ,getPost ,updatePost, deletePost } from '../controllers/postControllers.js';
const router = express.Router()

router.post('/createpost',createPost)
router.get('/:id',getPost)
router.put('/:id',updatePost)
router.delete('/:id', deletePost)
router.get('/allposts',getAllPosts)


export default router;