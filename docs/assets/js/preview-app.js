(function(){
  document.querySelectorAll(".catalog-toolbar input").forEach(function(input){
    input.addEventListener("input",function(){
      var term=input.value.toLowerCase();
      document.querySelectorAll(".food-panel").forEach(function(card){
        card.hidden=!card.textContent.toLowerCase().includes(term);
      });
    });
  });
  document.querySelectorAll(".food-panel-row button").forEach(function(button){
    button.addEventListener("click",function(){
      var title=button.closest(".food-panel").querySelector("h3").textContent;
      button.textContent="Ditandai";
      button.disabled=true;
      try{localStorage.setItem("joshis12-last-preview-order",title);}catch(e){}
    });
  });
  document.querySelectorAll(".seller-form button").forEach(function(button){
    button.addEventListener("click",function(){
      button.textContent="Listing ditambahkan";
      setTimeout(function(){button.textContent="Publikasikan";},1800);
    });
  });
})();
