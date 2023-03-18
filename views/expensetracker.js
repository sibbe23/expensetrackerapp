

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
                console.log(response.data)
                localStorage.setItem('token',response.data.token)
                window.location.href="/views/index.html"
    }
else{
    throw new Error('Failed to Login')
}}
    catch(err){
        console.log(JSON.stringify(err))
        document.body.innerHTML = `<div style="color:red">${err.message}</div>`
    }
}

function addNewExpense(e){
    e.preventDefault();

    const expenseDetails = {
        expenseamount : e.target.expenseamount.value,
        description : e.target.description.value,
        category : e.target.category.value
    }
    console.log(expenseDetails)
    const token = localStorage.getItem('token')
    axios.post('http://localhost:4000/expense/addexpense',expenseDetails,{headers:{'Authorization':token}})
    .then((response)=>{
            addNewExpensetoUI(response.data.expense);
    })
    .catch(err=>console.log(err))
}

window.addEventListener('DOMContentLoaded',()=>{
    const token = localStorage.getItem('token')
    axios.get('http://localhost:4000/expense/getexpenses',{headers:{'Authorization':token}})
    .then(response =>{
        response.data.expenses.forEach(expense=>{
            addNewExpensetoUI(expense)
        })
    })
    .catch(err=>console.log(err))
})

function addNewExpensetoUI(expense){
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenseamount} - ${expense.category} - ${expense.description}
            <button onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
}

function deleteExpense(e,expenseid){
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:4000/expense/deleteexpense/${expenseid}`,{headers:{'Authorization':token}})
    .then(()=>{
        removeExpensefromUI(expenseid);
    })
    .catch(err=>console.log(err))
}

function removeExpensefromUI(expenseid){
    const expenseElemId = `expense - ${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

