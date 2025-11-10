window.addEventListener("DOMContentLoaded", ()=>{
    const form = document.querySelector(".form");
    const errorMessage = document.querySelector(".error-message");
    const inputText = document.getElementById("input-text");
    const inputEmail = document.getElementById("input-email");
    const inputPassword = document.getElementById("input-password");
    const confirmPassword = document.getElementById("confirm-password");
    const checkbox = document.querySelector(".checkbox");

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        let errors = [];

        if(confirmPassword){
            errors = getSign(
                inputText.value.trim(),
                inputEmail.value.trim(),
                inputPassword.value,
                confirmPassword.value,
                checkbox.checked,
            )

            if(errors.length === 0){
                localStorage.setItem("data", JSON.stringify({
                    name: inputText.value.trim(),
                    email: inputEmail.value.trim(),
                    password: inputPassword.value,
                    check: checkbox.checked
                }))

                window.location.href = 'login.html'
            }
        }else{
            errors = getLogin(
                inputText.value.trim(),
                inputEmail.value.trim(),
                inputPassword.value,
                checkbox.checked,
            )

            if(errors.length === 0){
                const data = JSON.parse(localStorage.getItem("data")) || [];

                if(data && data.name === inputText.value.trim() && data.email === inputEmail.value.trim() && data.password === inputPassword.value && data.check === checkbox.checked){
                    sessionStorage.setItem("data", 'true')
                    window.location.href = "quiz.html"
                }else{
                    errors.push("Invalid Name or Password")
                    errorMessage.textContent = errors.join(". ")
                }
            }
        }

        if(errors.length > 0){
            errorMessage.textContent = errors.join(". ")
        }
    })

    function getLogin(name, email, password, check){
         let errors = [];

        if(!name){
            errors.push("Name is required")
            inputText.parentElement.classList.add("active")
        }

        if(!email){
            errors.push("Email is required")
            inputEmail.parentElement.classList.add("active")
        }

        if(!password){
            errors.push("Password is required")
            inputPassword.parentElement.classList.add("active")
        }else if(password.length < 8){
            errors.push("Password must exceed 8 characters")
            inputPassword.parentElement.classList.add("active")
        }
        if(!check){
            errors.push("Check the box before signing in")
        }

        return errors;
    }

    function getSign(name, email, password, repeatPassword, check){
        let errors = [];

        if(!name){
            errors.push("Name is required")
            inputText.parentElement.classList.add("active")
        }

        if(!email){
            errors.push("Email is required")
            inputEmail.parentElement.classList.add("active")
        }

        if(!password){
            errors.push("Password is required")
            inputPassword.parentElement.classList.add("active")
        }else if(password.length < 8){
            errors.push("Password must exceed 8 characters")
            inputPassword.parentElement.classList.add("active")
        }

        if(repeatPassword !== password){
            errors.push("Incorrect Password")
            confirmPassword.parentElement.classList.add("active")
            inputPassword.parentElement.classList.add("active")
        }

        if(!check){
            errors.push("Check the box before signing in")
        }

        return errors;
    }

    const allOption = [inputText, inputEmail, inputPassword, confirmPassword, checkbox].filter(Boolean);
    allOption.forEach((btn) => {
        btn.addEventListener("click", ()=>{
            if(btn.parentElement.classList.contains("active")){
                btn.parentElement.classList.remove("active")
            }
        })
    })

    const addElement = (input, icon)=>{
        const inputEl = document.getElementById(input);
        const iconEl = document.getElementById(icon);

        iconEl.addEventListener("click", ()=>{
            const isPassword = inputEl.type === "password";

            inputEl.type = isPassword ? "text" : "password";

            iconEl.classList.toggle("ri-eye-line", isPassword);
            iconEl.classList.toggle("ri-eye-off-line", !isPassword)
        })
    }
    addElement("input-password", "icon")
    addElement("confirm-password", "icons")
})