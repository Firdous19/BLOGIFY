const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const userRouter = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Blog = require('./models/blog');
const express = require('express');
const checkForAuthenticationCookie = require('./middleware/authentication');


const app = express();
const PORT = process.env.PORT;

//MongoDb connection
//mongodb://127.0.0.1:27017/Blogify
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("MongoDb Connected")
}).catch((err) => {
    console.log('Error');
})

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

app.set("view engine", "ejs");
app.set('views', path.resolve('./views'));

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render('home', {
        cookie: req.cookies["token"],
        user: req.user,
        blogs: allBlogs
    });
});


app.use('/user', userRouter);
app.use('/blog', blogRoute);

app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));