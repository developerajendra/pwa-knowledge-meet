db.enablePersistence().catch(error=>{
    console.log('error...',error);
})

db.collection('cards').onSnapshot((snapshot)=>{
    console.log('snapshot',snapshot.docChanges())
    snapshot.docChanges().forEach(change=>{
        console.log('snapshot change',change, change.doc.data())
        if(change.type =='added'){
            addCard(change.doc.data(),change.doc.id);
        }
        if(change.type == 'removed'){
            removedCard(change.doc.data(),change.doc.id);
            
        }
    })
}) 

// db.collection('cards').add({
//     title:'new title',
//     titleLink:'new title link',
//     description:'new description'
// });

const addCard = (data,id)=>{
    let container = document.querySelector('.card-container');
    const cardHtml =  `<div class=" mt-10 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl" data-id="${id}">
        <div>
            <div class="md:shrink-0">
                <img class="h-48 w-full object-cover md:h-full xl:w-48" src="images/icons/icon-512x512.png" alt="Man looking at item at a store">
            </div>
            <div class="p-8">
                <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">${data.title}</div>
                <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">${data.linkTitle}</a>
                <p class="mt-2 text-slate-500">${data.description}</p>
            </div>
        </div>
    </div>`
    container.innerHTML += cardHtml;
}