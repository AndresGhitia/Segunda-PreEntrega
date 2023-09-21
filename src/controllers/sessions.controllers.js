

export class SessionControllers{
    static renderSessionRegister = async(req, res) => {
        res.redirect('/login')
    }

    static renderSessionFail = async(req, res) => {
        res.send({status: 'error', message: 'Failed register'})
    }

    static renderSessionLogin = async(req, res) => {
        if(!req.user) return res.status(400).send({status: 'error', message: 'Invalid credentials'})
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            date_of_birth: req.user.date_of_birth,
            role: req.user.email == 'adminCoder@coder.com' ? 'admin' : 'user'
        }
        // res.send({status: 'success', payload: req.user})
        res.redirect('/products')
    }

    static renderSessionFailLogin =  async(req, res) => {
        res.send({status: 'error', message: 'Failed login'})
    }

    static renderSessionLogout = (req, res)=>{
        req.session.destroy(err => {
            if (err) return res.send({status: 'error', message: err})
            // res.send('Successfully logged out.')
            res.redirect('/login')
        })
    }

    static renderSessionGitHub = async (req, res)=>{

    }

    static renderSessionCallback = async (req, res)=>{
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            date_of_birth: req.user.date_of_birth,
            role: req.user.email == 'adminCoder@coder.com' ? 'admin' : 'user'
        }
        res.redirect('/products')
    }
}