const express = require("express")
const blogdata = require("./../models/blog");
const router = express.Router()
const Register = require("./../models/user");
const poss = require("./../middleware/poss");

router.get('/new', async(req, res) => {
    res.render('newarticle')
})


router.post('/new', poss, async(req, res) => {
    try {
        const newblog = new blogdata({
            title: req.body.title,
            description: req.body.description,
            markdown: req.body.markdown,
            emailId: req.user.email,
            name: req.user.firstname
        })
        const inserted = await newblog.save();
        res.status(201).redirect('/blog/article/my')
    } catch (e) {
        res.status(400).redirect('/blog');
    }
})


router.post('/edit/:id', async(req, res) => {
    const article = await blogdata.findByIdAndUpdate({ _id: req.params.id });
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown
    article.save();
    res.render('showblog', { post: article });
})

router.get('/edit/:id', async(req, res) => {
    const article = await blogdata.findById({ _id: req.params.id });
    res.render('editblog', { post: article });
})

router.get('/:slug', async(req, res) => {
    const act = await blogdata.findOne({ slug: req.params.slug });
    res.render("showblog", { post: act });
})

router.post('/check/:slug', async(req, res) => {
    try {
        const article = await blogdata.findOne({ slug: req.params.slug });
        const add = req.body.comm;
        article.comments = article.comments.concat({ comment: add });
        article.save();
        res.render("showblog", { post: article })
    } catch (e) {
        res.redirect('/blog');
    }
})

router.get('/article/my', poss, async(req, res) => {
    try {
        const act = await blogdata.find({ emailId: req.user.email }).sort({ createdAt: 'desc' });
        res.render("myarticle", { post: act });
    } catch (e) {
        res.status(400).redirect('/404error');
    }
})
router.delete('/:id', async(req, res) => {
    await blogdata.findByIdAndDelete(req.params.id)
    res.redirect('/blog/article/my')
})



module.exports = router;