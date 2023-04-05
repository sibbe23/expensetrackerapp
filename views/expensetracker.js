async function signup(e){
    try{
    e.preventDefault();
    const userDetails = {
        name:e.target.name.value,
        email:e.target.email.value,
        password:e.target.password.value
    }
    
    console.log(userDetails)

   const response = await axios.post('http://3.89.180.117:4000/user/signup',userDetails)
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

       const response =  await axios.post('http://3.89.180.117:4000/user/login',loginDetails)
            if(response.status = 201){alert(response.data.message)
                console.log(response.data)
                localStorage.setItem('token',response.data.token)
                localStorage.setItem('userDetails',JSON.stringify(response.data.user))
                window.location.href="../views/index.html"
    }
else{
    throw new Error('Failed to Login')
}}
    catch(err){
        console.log(JSON.stringify(err))
        document.body.innerHTML = `<div style="color:red">${err.message}</div>`
    }
}
async function addNewExpense(e){
    try{
    e.preventDefault();

    const expenseDetails = {
        expenseamount : e.target.expenseamount.value,
        description : e.target.description.value,
        category : e.target.category.value,
        income :e.target.income.value
    }
    console.log(expenseDetails)
    const token = localStorage.getItem('token')
   const expense = axios.post('http://3.89.180.117:4000/expense/addexpense',expenseDetails,{headers:{'Authorization':token}})
    console.log(expense)
}catch(err){console.log(err)
}}
function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = `<h4 class="text-center ">Premium Activated</h4>`
}
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
window.addEventListener('DOMContentLoaded',async()=>{
    try{
    const token = localStorage.getItem('token')
    const ltd = localStorage.getItem('row') || 10;
    const page=1;
    const decodeToken = parseJwt(token)
    // console.log(decodeToken)
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
        showPremiumuserMessage()
        showLeaderboard()
    }
    if(token){
   const response = await axios.get(`http://3.89.180.117:4000/expense/data?page=${page}=${ltd}`,{headers:{'Authorization':token}})
        console.log(response)
        // response.data.expenses.forEach(response=>            addNewExpensetoUI(response)
        // )
            showPagination(response)
        fetchExpenses(response)}
        else{
            location.replace('./login.html')
        }
}catch(err){
    console.log(err)
}})
    

// function addNewExpensetoUI(expense){

//     var x = document.getElementsByTagName('tr')
//     var i=0;
//     var txt=""
//     for(i;i<x.length;i++){
//         txt = x[i].rowIndex +1;
//     }
//     const tbodyElem = document.querySelector('tbody')
//     const expenseElemId = `expense-${expense.id}`;
//         tbodyElem.innerHTML +=`<tr id='${expenseElemId}' class="text-success datas">
//         <td>${txt}</td>
//         <td>${expense.expenseamount}</td>
//         <td>${expense.category}</td>
//         <td>${expense.description}</td>
//         <td>${expense.income}</td>
//         <td> <button class="btn btn-danger"onclick='deleteExpense(event, ${expense.id})' class="delbtn">
//         Delete Expense
//     </button></td>
//     </tr>
//         `
     
// }
function deleteExpense(e,expenseid){
    const token = localStorage.getItem('token')
    axios.delete(`http://3.89.180.117:4000/expense/deleteexpense/${expenseid}`,{headers:{'Authorization':token}})
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
    const response  = await axios.get('http://3.89.180.117:4000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id,
     "order_id": response.data.order.id,
     "handler": async function (response) {
        const res = await axios.post('http://3.89.180.117:4000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         window.location.reload()
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
    inputElement.className='btn btn-primary text-white widths'
    inputElement.onclick = async() => {
        inputElement.style.visibility="hidden"
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://3.89.180.117:4000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.totalExpenses || 0} </li>`
        })
    }
       // <button onclick="download()" id="downloadexpense" class="btn btn-dark text-white widths">Download File </button>
const downloadElem = document.createElement('input')
downloadElem.type='button'
downloadElem.id = 'downloadexpense'
downloadElem.className ='btn btn-primary text-white widths'
downloadElem.value = 'Download File'
const br = document.createElement('br')
const br1 = document.createElement('br')

downloadElem.onclick = async() =>{
download()    
}
    
    document.getElementById("message").appendChild(inputElement);
    document.getElementById('message').appendChild(br)
    document.getElementById('message').appendChild(br1)
    document.getElementById('message').appendChild(downloadElem)
}
// function forgotpassword() {
//     window.location.href = "./forgot.html"
// }
function download(){
    const token = localStorage.getItem('token')
    axios.get('http://3.89.180.117:4000/expense/download', { headers: {"Authorization" : token} })
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

const setRow = () => {
    let row = document.getElementById('rowOptions').value;
    localStorage.setItem("row", row);
  }
 
  //Pagination
  const pagination = document.getElementById('paginations')
const showPagination = async (response) => {
    pagination.innerHTML ="";
    if (response.data.hasPreviousPage) 
    {
      const btn = document.createElement("button");
      btn.className = "btn btn-dark"
      btn.innerHTML = response.data.previousPage;
       btn.addEventListener("click", async() =>
       {
        await getExpense(response.data.previousPage)
       });
      pagination.appendChild(btn);
    }
    const btn1 = document.createElement("button");
    btn1.className = "btn btn-success"
    btn1.innerHTML = `<h3>${response.data.currentPage}</h3>`;
     btn1.addEventListener("click", async() =>
     {
      await getExpense(response.data.currentPage)
     });
    pagination.appendChild(btn1);
    if (response.data.hasNextPage)
     {
      const btn2 = document.createElement("button");
      btn2.className = "btn btn-dark"
      btn2.innerHTML = response.data.nextPage;
      btn2.addEventListener("click", async () => 
      { 
        await getExpense(response.data.nextPage);
       
      });
      pagination.appendChild(btn2);
    }
  };
  const token = localStorage.getItem('token')
  const getExpense = async(page) => {
    const ltd = localStorage.getItem("row");
const expense = await axios.get(`http://3.89.180.117:4000/expense/data?page=${page}=${ltd}`, { headers: { 'Authorization': token }})
        console.log(expense)
        await  fetchExpenses(expense)
     await  showPagination(expense);

  }           

  const fetchExpenses = (response)=>{
    let expense = response.data.expenses
    // console.log(expense)
    for(let i=0;i<expense.length;i++){
        let tr = document.createElement('tr')
        let th = document.createElement("th");
        let td = document.createElement("td");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");
        let tbody = document.querySelector('.tbody')
        th.setAttribute("scope", "row");
        th.appendChild(document.createTextNode(i + 1));
        tr.appendChild(th);
        td.appendChild(document.createTextNode(expense[i].expenseamount));
        tr.appendChild(td);
        td1.appendChild(document.createTextNode(expense[i].category));
        tr.appendChild(td1);
        td2.appendChild(document.createTextNode(expense[i].description));
        tr.appendChild(td2);
        td3.appendChild(document.createTextNode(expense[i].income))
        tr.appendChild(td3)
        td4.innerHTML+=` <button class="btn btn-danger"onclick='deleteExpense(event, ${expense[i].id})'>Delete Expense</button>`
        tr.appendChild(td4)
        tbody.appendChild(tr)
    }
  }