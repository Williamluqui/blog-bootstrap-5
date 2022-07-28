
// Botao modal para deletar uma categoria

// function confirmarDelecao(event, form){
//     event.preventDefault();
//     let decision = confirm("Gostaria de deletar ? Esta ação não pode ser desfeita!");
//     if(decision){
//         bootstrapSuccess()
//         setTimeout(()=>{
//          form.submit();
//         },1300)
        
        
//     }
// }

async function loginMessage(){
    try {
        const response = await fetch('http://localhost:8080/authenticate/')
        const data = await response.json();
        show(data)
    } catch (error) {
        console.error(error)
    }
   
   loginMessage()
};
 function show(message){
    let output = '';
    for (let message of message) {
        output += `<h5> ${message}</h5>`
        
    }
    document.getElementById('message').innerHTML = output;
 }


// let btnModal = document.getElementById('btnDelete')
// btnModal.addEventListener('click',(e)=>{
//   e.preventDefault()
//   document.getElementById('formCategory').submit();
// })

// const btnModal = document.getElementById('btn-modal-delete');

// btnModal.addEventListener('click',(e) =>{
//     e.preventDefault()
//     const submitForm = document.getElementById('submit')

//     const dados = fetch('/articles/delete',{
//         method:"POST"
//     })
//     if (dados) {
//         submitForm.submit()
//     }
// })

// const modalConfirm = ()=>{
//     const btnForm = document.getElementById('btnForm')
    
    
// }



// formulario artigo ,prevencao de erros relacionado a campo vazio

const btnArticle = document.getElementById("btnCadastrar")

btnArticle.addEventListener('click',(e)=>{
e.preventDefault()
const formArticle = document.getElementById("formArticle")    
const article = document.getElementById("articlesJs");

if (!article.value == "") {
    $.bootstrapGrowl("Artigo cadastrado");
    setTimeout(()=>{
    console.log('titulo preenchido')
    formArticle.submit()
    },1200)  
  }else{
    console.log('preencha o titulo')
    bootstrapError()
}
})


// const editCategory = document.getElementById("edit-categories")
// const btnEdit = document.getElementById("btnEdit").addEventListener('click',(e)=>{
//     e.preventDefault()
//     setTimeout(()=>{
//         bootstrapSuccess()
//         submit()
//         },1300)
    
// })
// ;



function bootstrapSuccess(){
$(".bootstrap-growl").remove();
$.bootstrapGrowl(" deletado com Sucesso! ",{
type: "success",
offset:{from:"bottom",amount:70},
align:"right",
width: 300,
delay: 2000,
allow_dismiss: true,
stackup_spacing: 10
})
}

function bootstrapError(){
    $(".bootstrap-growl").remove();
    $.bootstrapGrowl("Ops preencha o titulo do artigo!!",{
    type: "danger",
    offset:{from:"bottom",amount:70},
    align:"right",
    width: 450,
    delay: 2000,
    allow_dismiss: true,
    stackup_spacing: 10
    })
    }
    
