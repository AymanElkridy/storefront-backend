import { Application } from "express"
import { loginHandler } from "./login"
import { logoutHandler } from "./logout"

const serivcesHandlers = (app: Application) => {
    app.post('login', loginHandler)
    app.get('logout', logoutHandler)
}

export default serivcesHandlers