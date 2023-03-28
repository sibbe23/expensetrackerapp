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
        const form = new FormData(e.target)
        
        const loginDetails ={
            email:form.get('email'),
            password:form.get('password')
        }

        console.log(loginDetails)

       const response =  await axios.post('http://localhost:4000/user/login',loginDetails)
            if(response.status = 201){alert(response.data.message)
                console.log(response.data)
                localStorage.setItem('token',response.data.token)
                localStorage.setItem('userDetails',JSON.stringify(response.data.user))
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
function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "<h4>Premium Activated</h4><h6>You can now download and save your expenses!</h6> "
}
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
window.addEventListener('DOMContentLoaded',()=>{
    const token = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
        showPremiumuserMessage()
        showLeaderboard()
    }
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
            <button onclick='deleteExpense(event, ${expense.id})' class="delbtn">
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
document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:4000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id,
     "order_id": response.data.order.id,
     "handler": async function (response) {
        const res = await axios.post('http://localhost:4000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
         showLeaderboard()
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
 });
}
function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.className='lobtn1'
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:4000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses || 0} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);

}
function forgotpassword() {
    window.location.href = "./forgot.html"
}
function download(){
    const token = localStorage.getItem('token')
    axios.get('http://localhost:4000/expense/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 200){
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            console.log('Error')
        }

    })
    .catch((err) => {
        console.log(err)
    });
}
