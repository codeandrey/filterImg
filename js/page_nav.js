var Pagination = {

    code: '',
   
    // --------------------
    // Utility
    // --------------------

    // converting initialize data
    Extend: function(data) {
        Pagination.size = data.size || 300;
        Pagination.page = data.page || 1;
        Pagination.page_per = data.page_per || 20;
    },
   
    // add pages by number (from [s] to [f])
    Add: function(s, f) {
        for (var i = s; i < f; i++) {
            Pagination.code += '<a>' + i + '</a>';
        }
    },

    // add last page with separator
  
    // --------------------
    // Handlers
    // --------------------

    // change page
    Click: function() {
        Pagination.page = +this.innerHTML;

        renderdisplay(LoadImg(Pagination.page));

        Pagination.Start();
    },

    // previous page
    Prev: function() {
        Pagination.page--;
        if (Pagination.page < 1) {
            Pagination.page = 1;
        }

        renderdisplay(LoadImg(Pagination.page));

        Pagination.Start();
    },

    // next page
    Next: function() {
        Pagination.page++;
        if (Pagination.page > Pagination.size) {
            Pagination.page = Pagination.size;
        }
       
        renderdisplay(LoadImg(Pagination.page));

        Pagination.Start();
    },

    // --------------------
    // Script
    // --------------------
 
   
   
        // binding pages
    Bind: function() {
        var a = Pagination.e.getElementsByTagName('a');
        for (var i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === Pagination.page) a[i].className = 'current';
              a[i].addEventListener('click', Pagination.Click, false);
        }

    },

    // write pagination
    Finish: function() {
        Pagination.e.innerHTML = Pagination.code;
        Pagination.code = '';
        Pagination.Bind();
    },

    // find pagination type
    Start: function() {
        if (Pagination.size < 8) {
            Pagination.Add(1, 2);
        }
        else if (Pagination.page < 3) {
            Pagination.Add(1, 6);
        }
        else if (Pagination.page > Pagination.size - 1 * 2) {
            Pagination.First();
            Pagination.Add(Pagination.size , Pagination.size + 1);
        }
        else {
           
           Pagination.Add(Pagination.page - 1, Pagination.page + 2);
           
        }
        Pagination.Finish();
    },



    // --------------------
    // Initialization
    // --------------------

    // binding buttons
    Buttons: function(e) {
        var nav = e.getElementsByTagName('a');
        nav[0].addEventListener('click', Pagination.Prev, false);
        nav[1].addEventListener('click', Pagination.Next, false);

    },

    // create skeleton
    Create: function(e) {

        var html = [
            '<a>&#9668;</a>', // previous button
            '<span></span>',  // pagination container
            '<a>&#9658;</a>'  // next button
        ];

        e.innerHTML = html.join('');
        Pagination.e = e.getElementsByTagName('span')[0];
        Pagination.Buttons(e);
    },

    // init
    Init: function(e, data) {
        Pagination.Extend(data);
        Pagination.Create(e);
        Pagination.Start();
    }
};



/* * * * * * * * * * * * * * * * *
* Initialization
* * * * * * * * * * * * * * * * */

var init = function() {
    Pagination.Init(document.getElementById('pagination'), {
        size: 300, // pages size
        page: 2,  // selected page
      //  step: 2,   // pages before and after current
        page_per: 20
    });
};

document.addEventListener('DOMContentLoaded', init, false);

var promiseImages;


var myListImg = function (){
   
  
     var ts =promiseImages.then(function(images) {
        var   list=[];
        var arr = JSON.parse(localStorage.getItem("myImg"))||[];
        for (var i=0; i<arr.length; i++)   {
                 for (var n=0; n<images.length; n++)   {
   
          if (arr[i]==images[n].id){
            list[i]=images[n];
      }
         
       }
   }
        return list;
     });
    return ts;
 }
 
var imgStore = function(imgId){
    var arr = JSON.parse(localStorage.getItem("myImg"))||[];
    for (var i = 0; i<arr.length; i++) {
        if (arr[i]==imgId) {
           return true;
       }else{
        return false;
       }
    }
    



}

var filterSise = function(arr, size){

  var res =arr.then(function(images) {
    var filterResult=[];
    for (var i = 0; i<images.length; i++){
       if ((images[i].width>size['minWidth'])&&(images[i].width<size['maxWidth'])) {
          filterResult[i]=images[i];
       }
    }
    return  filterResult;
  });
  return res;
} 

var filterAuthor = function(users, author){
  
  var res = users.then(function(arr) {
    var filterResult=[];
      for (var i = 0; i<arr.length; i++){

        if (arr[i].user['id'] == author) {
          filterResult[i]=arr[i];
        }
      }
       return  filterResult;
   });
  
   return res;
}

var SizeImgChecked = function (){
    var el = document.getElementById('radio__group'),
        radios=el.querySelectorAll('input'),
        filterImg=[],
        check;

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].type === 'radio' && radios[i].checked) {
            check = radios[i].value;    
        }
    }
    if (check=='all'){
      filterImg['minWidth'] = 0; filterImg['maxWidth'] =10000;
    }   
      else if (check=='large'){
        filterImg['minWidth']= 4500; filterImg['maxWidth'] =10000;
      }
        else if (check=='medium'){
          filterImg['minWidth']= 2500; filterImg['maxWidth'] =4499;
        }   
          else if (check=='small') {
            filterImg['minWidth']= 0; filterImg['maxWidth'] =2499;
          }

    return filterImg;
}

var AuthorChecked = function (){
  var el = document.getElementById('author__group'),
      radios=el.querySelectorAll('input'),
      check;

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].type === 'radio' && radios[i].checked) {
      check = radios[i].id;    
    }
  }
  return check;
}

var LoadImg = function(page){
   
    getJSON = function(url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open('get', url, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                var status = xhr.status;
                if (status == 200) {
                    arr=xhr.response;
                    Pagination.size= parseInt(xhr.getResponseHeader('x-total'));
                    resolve(arr);
                } else {
                    reject(status);
                }
            };
            xhr.send();
        });
    };
    
    query_url='https://api.unsplash.com/photos/?client_id=e879405519ab1a1043728365faeaa75dda8ff109fc47df38aef56b7a647860fe&page='+page+'&per_page=200';
    var  dataResult =getJSON(query_url).then(function(response) {
        return response;           
        }, function(status) { 
          
    });
    return dataResult;
}

var LoadAuthor=function (){
    promiseImages.then(function(arr) {
        console.log(arr);
    for(var i=0; i<arr.length; i++){
        var author = document.createElement('input');
        var label =document.createElement('label'); 
        var span =document.createElement('span'); 
        author.type= 'radio';
        author.name = 'author';
        author.id= arr[i].user['id'];
        author.value=arr[i].user['name'];
        label.appendChild(author);
        label.append(arr[i].user['name']);
        label.append(span);
        document.getElementById('author__group').appendChild(label)
    }
    });

    
}
    
var radioClick = document.getElementById('radio__group');
    radioClick.addEventListener('click',  function(e){ 
    renderdisplay(filterSise(promiseImages, SizeImgChecked()));
    }, false); 

var authorClick = document.getElementById('author__group');
    authorClick.addEventListener('click',  function(e){ 
      if  (AuthorChecked()=='all-author' ){
            renderdisplay(promiseImages);
        }else {
            renderdisplay(filterAuthor(promiseImages,AuthorChecked()));
        }
    }, false); 



var mylist=[];

var gridClick = document.getElementById('grid');
    gridClick.addEventListener('click', function(e){
    
        var click_id = event.srcElement.id;
        // event.srcElement.nextNode().innerHTML='&#x2605';
   
        mylist.push(click_id);

        var serialObj = JSON.stringify(mylist); 

        localStorage.setItem("myImg", serialObj); 

    }, false);

var imgStore = function(imgId){
    var arr = JSON.parse(localStorage.getItem("myImg"))||[];
    for (var i = 0; i<arr.length; i++) {
        if (arr[i]==imgId) {
           return true;
       }else{
        return false;
       }
    }
    
}

var mylistClick = document.getElementById('mylist');
    mylistClick.addEventListener('click', function(e){
     promiseImages=myListImg();
        renderdisplay(filterSise(promiseImages, SizeImgChecked())); 
    });

var renderdisplay = function(arr){
    arr.then(function(pic) {

        var item = document.getElementById("grid");
        item.innerHTML = '';
        if (typeof pic !== 'undefined' && pic.length > 0){
            for(var i=0; i<pic.length; i++){
                var div = document.createElement('div');

                var span = document.createElement('span');

                var img = document.createElement('img');
                img.src=pic[i].urls['small'];
                img.id=pic[i].id;
                div.appendChild(img);
               if(imgStore(pic[i].id)){ 
                    span.innerHTML='&#x2605';
                }else{
                    span.innerHTML='&#x2606;';
                }
                div.append(span);
                document.getElementById('grid').appendChild(div);
            }
        }
    });


}

promiseImages=LoadImg(1);

renderdisplay(promiseImages); 
LoadAuthor();

