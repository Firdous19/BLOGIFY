const { Router } = require('express');
const multer = require('multer');
const router = Router();
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()} - ${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage })


router.get('/addnew', (req, res) => {
    return res.render('addblog', {
        user: req.user
    })
});

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments=await Comment.find({blogId: req.params.id}).populate('createdBy');           
    console.log(comments)
    return res.render('blog', {
        user: req.user,
        blog: blog,
        comments
    })
})

router.post("/", upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const { filename } = req.file;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
});

router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    });

    return res.redirect(`/blog/${req.params.blogId}`);
    // return res.render('blog')
});

module.exports = router;