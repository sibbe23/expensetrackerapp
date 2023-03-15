

async function signup(e){
    try{
    e.preventDefault();
    const userDetails = {
        name:e.target.name.value,
        email:e.target.email.value,
        password:e.target.password.value
    }

    console.log(userDetails)

   const response = await axios.post('http://localhost:4000/user/signup',userDetails)
     if(response.status === 201)
     {
        window.location.href="/views/login.html"
     }
     else{
        throw new Error('Failed to Login')
     }
}catch(err){
    document.body.innerHTML +=`<div style="color:red">${err.message}</div>`;
    }
}

async function login(e){
    try{
        e.preventDefault();
        console.log(e.target.name);
        
        const loginDetails ={
            email:e.target.email.value,
            password:e.target.password.value
        }

        console.log(loginDetails)

       const response =  await axios.post('http://localhost:4000/user/login',loginDetails)
            if(response.status = 201){alert(response.data.message)
    }
else{
    throw new Error('Failed to Login')
}}
    catch(err){
        console.log(JSON.stringify(err))
        document.body.innerHTML = `<div style="color:red">${err.message}</div>`
    }
}