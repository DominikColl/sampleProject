const serverName="star-decision";
const getList=`https://${serverName}.glitch.me/api/lists`
const postItem=`https://${serverName}.glitch.me/api/items`;
const key ="?accessToken=5b1064585f4ab8706d275f90";
let noteCollection=[];
let listId=0;
//event that triggers when browser size changes
// window.addEventListener('resize',()=>{
//    Logic.getObject();
// });
document.addEventListener("DOMContentLoaded",()=>{
    Logic.getObject();
   Logic.nightMode();
})
class Logic{
    constructor(){
        console.log("logic created");
    } 
    static addTask(title,listId,descrip,dueDate){
        // /items
        //i think due date will only take numbers no strings 500 error with string 
        let q=parseInt(dueDate);
       const data={
        "title": `${title}`,
        "listId": `${listId+1}`,
        "description": `${descrip}`,
        "dueDate": q
       }
       const config={
           method:'POST',
           body:JSON.stringify(data),
           headers:{'content-type': 'application/json'}
       }
       fetch(postItem+key,config)
       .then(r =>{
        if(r.ok){
            this.getObject();
        }
       }).then(()=>{
           this.getObject();
       })
    }
    static getObject(){
        fetch(getList+key)
        //.then means this will happen when the line above is done completley  parameter being the object returned from the line above
        .then(res =>{
            //parsing to become json object
            return res.json();
        })
        .then(resJ =>{
            //json object 
             this.getData(resJ);
             this.displayData(resJ);
             //function that takes this object as param and displays data using inner html
        });
    }
    static getData(results){
        for(let i=0;i<results.length;i++){
            let n=new Notes(results[i].id,results[i].title,results[i].items);
            noteCollection.push(n);
        }
    }
    static displayData(results){
        let html="";
        let list00=results[0].items;
        let list01=results[1].items;
        let list02=results[2].items;
        list00=this.createListItems(list00);
        list01=this.createListItems(list01);
        list02=this.createListItems(list02);
       let liCollection=[list00,list01,list02];
       //loops three times needs function that returns array of items 
        results.forEach((results,i)=>{
            html+=`<section>
            <h2>${results.title}</h2>
           <button class='addTask'>Add Task</button><div></div>
            <ul>
                ${liCollection[i]}
            </ul>
         </section>`
        });
        document.querySelector("main").innerHTML=html; 
        let addTask=document.querySelectorAll('.addTask');
        addTask.forEach((d,i)=>{
            d.addEventListener("click",()=>{
                 listId=i;
                document.querySelectorAll("section div")[0].innerHTML="";
                document.querySelectorAll("section div")[1].innerHTML="";
                document.querySelectorAll("section div")[2].innerHTML="";
                document.querySelectorAll("section div")[listId].innerHTML=`<form>
                <label>Title</label>
                <input type='text' id='cTitle' name='title'>
                <label>Descrip</label>
                <input type='text' id='cDescrip' name='descrip'>
                <label>Due Date</label>
                <input type='text' id='cDueDate' name='dueDate'>
                <div class='error'></div>
                <button type='button' id='submit'>Submit</button>
                <button type='button' id='back'>Back</button>
                </form>`;
                document.querySelector('#back').addEventListener('click',()=>{
                    document.querySelectorAll("section div")[listId].innerHTML='';
                });
                document.querySelector('#submit').addEventListener('click',()=>{
                    let title= document.querySelector('#cTitle').value;
                    let descrip= document.querySelector('#cDescrip').value;
                     let dueDate=document.querySelector('#cDueDate').value;
                    document.querySelector('.error').innerHTML='';
                if(title.length>0&&descrip.length&&dueDate.length){
                    console.log('submit');
                    this.addTask(document.querySelector('#cTitle').value,i,document.querySelector('#cDescrip').value),document.querySelector('#cDueDate').value;
                }else{
                    document.querySelector('.error').innerHTML='<p>One or more field is missing</p>';
                }
            })
            });
        });  
    };
    //checks descrip length and limits description if needed 
    static checkDescripLength(text){
        if(text.length>60&&window.screen.width>768){
            text=text.substring(0,56)+'...';
        }
        return text
    }
    //foreach that goes through list items of the list and creates lis as needed return as string
    static createListItems(item){
        let temphtml="";
        item.forEach(item=>{
            temphtml+=`  <li>
            <h3>${item.title}</h3>
            <p>${this.checkDescripLength(item.description)}</p>
            <img src="cal.png" alt="calender">
            <time datetime="2018-05-10">10/5/2018</time>
        </li>`
        });
        return temphtml; 
    }
    static nightMode(){
        let counter=0;
         console.log(counter);
        let droplet= document.querySelector('nav img');
        droplet.addEventListener('click',()=>{
            if(counter==1){
                counter--;
                document.querySelector('nav').classList.add('nightmodeNav');
                document.querySelector('body').classList.add('nightmodeBody');
            }else if(counter==0){
                counter++;
                document.querySelector('nav').classList.toggle('nightmodeNav');
                document.querySelector('body').classList.toggle('nightmodeBody');
            }
           localStorage.setItem('DarkMode',counter)
        });
        if(localStorage.getItem('DarkMode')){
            counter=localStorage.getItem('DarkMode');
            if(counter==0){
                document.querySelector('nav').classList.toggle('nightmodeNav');
                document.querySelector('body').classList.toggle('nightmodeBody');
            }
    }
}
} 