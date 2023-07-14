import { useState, useEffect } from "react";
import { getUser, addUser as addUserApi, login, getSelf } from "../api/profile";


export default function PageProfile() {
    return (
        <>
            <div>
                <h1>It's dangerous to go alone. 
                    <br></br>Take this 🌮</h1>
            </div>
            <div>
                Add User
                <AddUser />
            </div>
            <div>
                Login
                <Login />
            </div>
            <div>
                User Information
                <UserInfo />
            </div>
        </>
    );
}

function AddUser() {

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const userToAdd = Object.fromEntries(formData.entries());

        addUserApi(userToAdd);
    }
    return (
        <form method="post" onSubmit={handleSubmit}>
            Username: <input name="name" required />
            <br />
            email: <input name="email" required />
            <br />
            Password: <input name="password" required />
            <br />
            <button className="btn btn-success" type="submit">Add</button>
        </form>
    );
}

function Login() {
    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const user = Object.fromEntries(formData.entries());

        login(user);
    }
    return (
        <form method="post" onSubmit={handleSubmit}>
            Username: <input name="name" required />
            <br />
            Password: <input name="password" required />
            <br />
            <button className="btn btn-success" type="submit">Add</button>
        </form>
    );
}

function UserInfo() {
    const [self, setSelf] = useState(null);
    useEffect(() => {
        getSelf().then((fetchedSelf) => setSelf(fetchedSelf));
    }, []);
    if (self) {
        return (
            <>
                <div>
                    {self.id}
                    <br/>
                    {self.name}
                    <br/>
                    {self.email}
                </div>
            </>
        )
    }
}