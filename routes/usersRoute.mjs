import express, { response } from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import DBManager from "../modules/storageManager.mjs";




const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

//const users = [];

USER_API.get('/', (req, res, next) => {
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})




USER_API.get('/:id', (req, res, next) => {

    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object
})

USER_API.post('/', async (req, res, next) => {

    // This is using javascript object destructuring.
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
    const { name, email, pswHash } = req.body;

    if (name != "" && email != "" && pswHash != "") {
        const user = new User();
        user.name = name;
        user.email = email;

        ///TODO: Do not save passwords.
        user.pswHash = pswHash;

        ///TODO: Does the user exist?
        let exists = await DBManager.exists(user);

        if (!exists) {
            DBManager.createUser(user);
            res.status(HTTPCodes.SuccesfullRespons.Ok).end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});

USER_API.put('/:id', (req, res) => {
    /// TODO: Edit user
})

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
})


USER_API.post('/login', async (req, res, next) => {
    const { email, pswHash } = req.body;
    const user = await DBManager.getUserFromEmail(email);
    const shemaRespond = {
        code: HTTPCodes.SuccesfullRespons.Ok,
        msg: "",
        data: ""
    }
    if (user) {
        if (user.pswhash === pswHash) {
            shemaRespond.code = HTTPCodes.SuccesfullRespons.Ok;
            shemaRespond.msg = "Login ok!";
            shemaRespond.data = user;
        } else {
            shemaRespond.code = HTTPCodes.ClientSideErrorRespons.Unauthorized;
            shemaRespond.msg = "Wrong password!";
            shemaRespond.data = null;
        }
    } else {
        shemaRespond.code = HTTPCodes.ClientSideErrorRespons.Unauthorized;
        shemaRespond.msg = "Wrong email!";
        shemaRespond.data = null;
    }
    res.status(shemaRespond.code).send(JSON.stringify(shemaRespond));
})
export default USER_API
