const meals = document.getElementById("meals");
const favContainer = document.getElementById("fav-meals")



const searchTerm = document.getElementById("search-term"); 
const searchBtn = document.getElementById("search") ;


const mealInfo = document.getElementById("meal-info");
const info_container = document.getElementById("meal-info-container");
const closeBtn = document.getElementById("closePop");

async function getRandomMeal(){
   const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
   const respDATA = await resp.json();
   const randomMeal = respDATA.meals[0]
   // console.log(randomMeal)

   loadRandomMeal(randomMeal , true);
}



getRandomMeal();
fetchFavMeal();
reGenerateMeal()

async function getMeaById(id){
   const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
   const respDATA = await resp.json();
   const meal = respDATA.meals[0];
   return meal;
}

async function Search(term){
   const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term)
   const respDATA = await resp.json();
   const meals = respDATA.meals;
   return meals
}




function loadRandomMeal(mealData, random = false){
const meal = document.createElement('div')
   meal.classList.add("meal");
   meal.innerHTML = `
            <div class="meal-header">
               ${random ? `
               <span class="random">
                  Random Recipe 
               </span>` : ``}
               <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
            </div>
            <div class="meal-body">
               <h4>${mealData.strMeal}</h4>
               <button class="fav">
                  <i class="fas fa-heart"></i>
               </button>
            </div>
         `;

   meal.querySelector(".meal-body .fav").addEventListener('click', () =>{
      const favBtn = document.querySelector(".meal-body .fav")
      if(favBtn.classList.contains("active")){
         removeMealLS(mealData.idMeal)
         favBtn.classList.remove("active");
      }else {
         addMealLS(mealData.idMeal)
         favBtn.classList.add("active");
      }
      
      fetchFavMeal()
   });


   
   meal.addEventListener("click", () => {
      updateMealInfo(mealData)
   })
   meals.appendChild(meal);

}



function addMealLS(mealId){
   const mealIds = getMealLS();
   localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))

}

function removeMealLS(mealId){
   const mealIds = getMealLS();
   localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)))

}

function getMealLS(){
   const mealIds = JSON.parse(localStorage.getItem('mealIds')) 
   return mealIds === null ? [] : mealIds;
}


async function fetchFavMeal(){
   // clear fav 
   favContainer.innerHTML = '';

   const mealIds = getMealLS();


   for(let i = 0; i < mealIds.length; i++){
      const mealId = mealIds[i];
      meal = await getMeaById(mealId);
      addMealFav(meal)
   }


   // add them to the screen

}


function addMealFav(mealData){
   const favMeal = document.createElement('li')
      favMeal.innerHTML = `
         <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
         <span>${mealData.strMeal}</span>
         <button class="clear"><i class="fa-solid fa-circle-minus"></i></button>
            `;



      const btn = favMeal.querySelector(".clear");
      btn.addEventListener("click", () => {
         removeMealLS(mealData.idMeal);
         fetchFavMeal();
      })

      favMeal.addEventListener("click", () => {
         updateMealInfo(mealData)
         console.log(mealData)
      })
      favContainer.prepend(favMeal)
   
   }

function reGenerateMeal(){
   const btn = document.getElementById("genrate");
   btn.addEventListener("click", () => {
   meals.innerHTML = '';
   getRandomMeal();
   })
}





searchBtn.addEventListener("click", async () => {
   meals.innerHTML = "";
   searchTerm.style.border = "none";
   const search = searchTerm.value;
   const searchMeals = await Search(search);
   if(searchMeals){
      searchMeals.forEach((meal) => {
         loadRandomMeal(meal);
      });
   }else{
      searchTerm.style.border = "2px solid red"
   };
});

function bluSearch(){
   if(searchTerm.value === ''){
   meals.innerHTML = "";
   getRandomMeal();
   }
}





function closePOP(){
   info_container.classList.remove("show");
}



function updateMealInfo(mealData){
   mealInfo.innerHTML = "";
   const mealEl = document.createElement("div");

   const ings = []; 
   for(let i = 1; i <20; i++){
      if((mealData[`strIngredient${i}`])){
         ings.push(`${mealData["strIngredient"+i]}  //  ${mealData["strMeasure"+i]}`)
      }else {
         break;
      }
   }



   mealEl.innerHTML = `
            <button class="closePop" onclick="closePOP()" id="closePop"><i class="fa-solid fa-xmark"></i></button>
            <h1>${mealData.strMeal}</h1>
            <img src="${mealData.strMealThumb}" alt="">
            <p>${mealData.strInstructions}
            </p>
            <h3> Ingredient :</h3>
            <ul>
               ${ings.map(ing => `
               <li>+  ${ing}</li>
               `).join('')}
            </ul>
            <button class="fav">
                  <i class="fas fa-heart" aria-hidden="true"></i>
            </button>
   `


   mealInfo.appendChild(mealEl);
   info_container.classList.add("show")
}