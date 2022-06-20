
// Botao modal para deletar uma categoria



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

// const btnArticle = document.getElementById("btnCadastrar")

// btnArticle.addEventListener('click',(e)=>{
// e.preventDefault()
// const formArticle = document.getElementById("formArticle")    
// const article = document.getElementById("articlesJs");

// if (!article.value == "") {
//     $.bootstrapGrowl("Artigo cadastrado");
//     setTimeout(()=>{
//     console.log('titulo preenchido')
//     formArticle.submit()
//     },1200)  
//   }else{
//     console.log('preencha o titulo')
//     bootstrapError()
// }
// })







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
$.bootstrapGrowl(" Categoria deletada !!",{
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
    
