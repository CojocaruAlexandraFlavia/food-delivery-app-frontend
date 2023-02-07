
const functions = {

    loginPromise: async (email, password) => {

        const controller = new AbortController()
        const signal = controller.signal

        const body = JSON.stringify({
            "email": email,
            "password": password
        })
        return await fetch("/login", {
            signal: signal,
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: body
        })
    }
}

export default functions