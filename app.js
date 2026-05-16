const categoryMeta = {
  main: {
    title: "מנה עיקרית",
    desc: "מנות בשר, עוף, דגים ותבשילים",
    icon: "🍗",
    className: "main"
  },
  side: {
    title: "תוספות",
    desc: "אורז, תפוחי אדמה, ירקות ועוד",
    icon: "🍚",
    className: "side"
  },
  dessert: {
    title: "קינוחים",
    desc: "עוגות, קרמים, מאפים מתוקים",
    icon: "🍰",
    className: "dessert"
  },
  starters: {
    title: "מנות פתיחה",
    desc: "מנות קלות, ראשונות והגשה מוקדמת",
    icon: "🥗",
    className: "starters"
  },
  baked: {
    title: "מאפים",
    desc: "מלוחים, לחמים ומאפים טריים",
    icon: "🥐",
    className: "baked"
  },
  breakfast: {
    title: "ארוחת בוקר",
    desc: "כריכים, ביצים, גבינות ותוספות",
    icon: "🍳",
    className: "breakfast"
  },
  salad: {
    title: "סלטים",
    desc: "ירקות טריים, סלטים מוכנים ומיוחדים",
    icon: "🥬",
    className: "salad"
  },
  fridayDinner: {
    title: "ארוחות שישי",
    desc: "מנות מסורתיות והגשה משפחתית",
    icon: "🍲",
    className: "fridayDinner"
  }
};

const titleEl = document.getElementById("title");
const mainTopbar = document.getElementById("mainTopbar");
const homeView = document.getElementById("homeView");

const categoriesEl = document.getElementById("categories");

const recipesHomeBtn = document.getElementById("recipesHomeBtn");

const recipesHomeBtn2 = document.getElementById("recipesHomeBtn2");

const shoppingHomeBtn = document.getElementById("shoppingHomeBtn");

const addRecipeHomeBtn = document.getElementById("addRecipeHomeBtn");
const backBtn = document.getElementById("backBtn");
const shoppingBtn = document.getElementById("shoppingBtn");
const addRecipeBtn = document.getElementById("addRecipeBtn");
const recipeView = document.getElementById("recipeView");
const recipeTitle = document.getElementById("recipeTitle");
const recipeContent = document.getElementById("recipeContent");

const userView = document.getElementById("userView");
const usernameInput = document.getElementById("usernameInput");
const saveUsernameBtn = document.getElementById("saveUsernameBtn");

const shoppingView = document.getElementById("shoppingView");
const shoppingInput = document.getElementById("shoppingInput");
const addShoppingItemBtn = document.getElementById("addShoppingItem");
const shoppingList = document.getElementById("shoppingList");

const addRecipeView = document.getElementById("addRecipeView");
const newRecipeCategory = document.getElementById("newRecipeCategory");
const newRecipeSubcategory = document.getElementById("newRecipeSubcategory");
const newRecipeTitle = document.getElementById("newRecipeTitle");
const newRecipeContent = document.getElementById("newRecipeContent");
const saveNewRecipeBtn = document.getElementById("saveNewRecipeBtn");
const addRecipeStatus = document.getElementById("addRecipeStatus");

const SHOPPING_ALLOWED_USERS = ["גיא", "מוניקה", "ליאן", "אמה"];

const SHOPPING_COLLECTION = "shoppingItems";

const RECIPE_ALLOWED_USERS = ["גיא"];
let currentCategory = null;
let pathStack = [];

let editingRecipeId = null;
let editingRecipeCategory = null;

function getUsername() {
  return localStorage.getItem("recipeAppUsername") || "";
}

function canAccessShoppingList() {
  return SHOPPING_ALLOWED_USERS.includes(getUsername());
}

function canAddRecipe() {
  return RECIPE_ALLOWED_USERS.includes(getUsername());
}

function saveUsername() {
  const username = usernameInput.value.trim();

  if (!username) return;

  localStorage.setItem("recipeAppUsername", username);
  userView.classList.add("hidden");

showHome();
}

function checkUsername() {
  const username = getUsername();

  if (!username) {
    categoriesEl.classList.add("hidden");
    recipeView.classList.add("hidden");
    shoppingView.classList.add("hidden");
    userView.classList.remove("hidden");
    titleEl.textContent = "ברוכים הבאים";
    return;
  }

  userView.classList.add("hidden");
showHome();
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function isRecipe(value) {
  return isObject(value) && "content" in value && "id" in value;
}

function hideAllViews() {
  homeView.classList.add("hidden");
  categoriesEl.classList.add("hidden");
  recipeView.classList.add("hidden");
  shoppingView.classList.add("hidden");
  addRecipeView.classList.add("hidden");
}

function showCategories() {
  hideAllViews();

  if (mainTopbar) {
    mainTopbar.classList.remove("hidden");
  }

  categoriesEl.classList.remove("hidden");
}

function getRandomRecipeFromData() {
  const recipes = [];

  function walk(node) {
    Object.entries(node || {}).forEach(([key, value]) => {
      if (isRecipe(value) && value.content && value.content.trim() !== "") {
        recipes.push({
          title: value.title || key,
          data: value
        });

        return;
      }

      if (isObject(value) && !isRecipe(value)) {
        walk(value);
      }
    });
  }

  walk(data);

  if (recipes.length === 0) {
    return null;
  }

  return recipes[
    Math.floor(Math.random() * recipes.length)
  ];
}
function showHome() {
  hideAllViews();

  homeView.classList.remove("hidden");

  if (mainTopbar) {
    mainTopbar.classList.add("hidden");
  }

  titleEl.textContent = `שלום ${getUsername()}`;

  const homeUserName = document.getElementById("homeUserName");
  const homeRecipeOfDay = document.getElementById("homeRecipeOfDay");

  if (homeUserName) {
    homeUserName.textContent = `${getUsername()} 👋`;
  }

const randomRecipe = getRandomRecipeFromData();

window.recipeOfDay = randomRecipe;

if (homeRecipeOfDay && randomRecipe) {
  homeRecipeOfDay.textContent = randomRecipe.title;
}
}

function getNode() {
  let node = currentCategory ? data[currentCategory] : data;

  for (const step of pathStack) {
    node = node[step];
  }

  return node || {};
}

function getIcon(key, value) {
  const text = String(key || "");

  const iconRules = [
    { words: ["עוף", "פרגית", "שניצל"], icon: "🍗" },
    { words: ["בשר", "סטייק", "צלי", "קציצה", "קציצות", "המבורגר"], icon: "🥩" },
    { words: ["דג", "דגים", "סלמון", "טונה"], icon: "🐟" },
    { words: ["פסטה", "ספגטי", "רביולי", "ניוקי"], icon: "🍝" },
    { words: ["אורז", "ריזוטו"], icon: "🍚" },
    { words: ["תפוח אדמה", "תפוחי אדמה", "פירה"], icon: "🥔" },
    { words: ["בטטה"], icon: "🍠" },
    { words: ["סלט", "ירקות"], icon: "🥗" },
    { words: ["מרק"], icon: "🍲" },
    { words: ["לחם", "חלה", "פיתה", "מאפה", "בורקס", "חצ׳פורי"], icon: "🥐" },
    { words: ["גבינה", "גבינות"], icon: "🧀" },
    { words: ["ביצה", "ביצים", "חביתה", "שקשוקה"], icon: "🍳" },
    { words: ["עוגה", "קינוח", "שוקולד", "עוגיות", "מוס"], icon: "🍰" },
    { words: ["רוטב", "מטבל", "טחינה"], icon: "🥣" }
  ];

  const match = iconRules.find((rule) =>
    rule.words.some((word) => text.includes(word))
  );

  if (match) {
    return match.icon;
  }

  return "🥘";
}


function getRecipeExamples(categoryData) {
  const examples = [];

  Object.entries(categoryData || {}).forEach(([key, value]) => {
    if (isObject(value) && !isRecipe(value)) {
      examples.push(key);
      return;
    }

    if (typeof value === "string" && value.trim() !== "") {
      examples.push(key);
      return;
    }

    if (isRecipe(value) && value.content && value.content.trim() !== "") {
      examples.push(key);
      return;
    }
  });

  return examples.slice(0, 3).join(" · ");
}

function countRecipes(node) {
  let count = 0;

  function walk(obj) {
    Object.values(obj || {}).forEach((value) => {
      if (typeof value === "string") {
        if (value.trim() !== "") {
          count++;
        }
        return;
      }

      if (isRecipe(value)) {
        if (value.content && value.content.trim() !== "") {
          count++;
        }
        return;
      }

      if (isObject(value)) {
        walk(value);
      }
    });
  }

  walk(node);

  return count;
}

function showRecipe(name, recipeData) {
  hideAllViews();
  recipeView.classList.remove("hidden");
  if (mainTopbar) {
  mainTopbar.classList.remove("hidden");
}
recipeTitle.textContent = name;

const content =
  typeof recipeData === "string"
    ? recipeData
    : recipeData?.content || "";

recipeContent.innerHTML =
  (content && content.replace(/\n/g, "<br>")) ||
  "עדיין לא הוזן מתכון לפריט הזה";

  if (getUsername() === "גיא" && recipeData?.id) {
  const editBtn = document.createElement("button");

  editBtn.textContent = "✏️ ערוך מתכון";
  editBtn.className = "edit-recipe-btn";

  editBtn.addEventListener("click", () => {
    editingRecipeId = recipeData.id;
    editingRecipeCategory = currentCategory;

    hideAllViews();
    addRecipeView.classList.remove("hidden");

    newRecipeCategory.value = currentCategory || "";
    newRecipeSubcategory.value = pathStack.length > 0 ? pathStack[pathStack.length - 1] : "";
    newRecipeTitle.value = name;
    newRecipeContent.value = content;

    saveNewRecipeBtn.textContent = "שמור שינויים";
    addRecipeStatus.textContent = "";
    titleEl.textContent = "עריכת מתכון";

    scrollToTop();
    history.pushState({}, "");
  });

  recipeContent.appendChild(editBtn);

  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "🗑️ מחק מתכון";
  deleteBtn.className = "delete-recipe-btn";

  deleteBtn.addEventListener("click", async () => {
    const confirmed = confirm("למחוק את המתכון?");

    if (!confirmed) return;

    try {
await window.firebaseDeleteDoc(
  window.firebaseDoc(
    window.firebaseDb,
    "recipes",
    recipeData.id
  )
);

      alert("המתכון נמחק");

      currentCategory = null;
      pathStack = [];

      await loadRecipes();

    } catch (error) {
      console.log(error);
      alert("שגיאה במחיקה");
    }
  });

  recipeContent.appendChild(deleteBtn);
}

titleEl.textContent = name;
  scrollToTop();
}

function renderCategories(node) {
  categoriesEl.innerHTML = "";
  showCategories();

  const categoryOrder = [
    "breakfast",
    "starters",
    "salad",
    "main",
    "side",
    "baked",
    "dessert",
    "fridayDinner"
  ];

  const entries = !currentCategory
    ? categoryOrder
        .filter((key) => node && node[key])
        .map((key) => [key, node[key]])
    : Object.entries(node || {});

  entries.forEach(([key, value]) => {
   const meta = !currentCategory && categoryMeta[key]
  ? categoryMeta[key]
  : {
      title: key,
     desc: isObject(value) && !isRecipe(value) ? "פתח תת-קטגוריה" : "פתח מתכון",
      icon: getIcon(key, value),
      className: ""
    };

console.log("icon check:", key, meta.icon);

    const button = document.createElement("button");
    button.className = `category ${meta.className}`.trim();
    button.type = "button";

    const descText = getRecipeExamples(value) || meta.desc;
    
        button.innerHTML = `
      <div class="category-right">
        <div class="category-icon">${meta.icon}</div>
        <div class="category-texts">
<div class="category-title">
  ${meta.title}
  ${
    isObject(value) && !isRecipe(value)
      ? `(${countRecipes(value)})`
      : ""
  }
</div>
          <div class="category-desc">${
            !currentCategory
              ? getRecipeExamples(value) || meta.desc
              : meta.desc
          }</div>
        </div>
      </div>
      <div class="category-arrow">›</div>
    `;

    button.addEventListener("click", () => {
     if (key === "shopping" && !currentCategory) {
  if (!canAccessShoppingList()) {
    alert("אין לך הרשאה לגשת לרשימת הקניות");
    return;
  }

  currentCategory = null;
  pathStack = [];
  hideAllViews();
  shoppingView.classList.remove("hidden");
  titleEl.textContent = "רשימת קניות";
  loadShoppingList();
  scrollToTop();
  history.pushState({}, "");
  return;
}

      if (!currentCategory) {
        currentCategory = key;
        pathStack = [];
        titleEl.textContent = categoryMeta[key]?.title || key;
        renderCategories(data[key]);
        scrollToTop();
        history.pushState({}, "");
        return;
      }

      if (isRecipe(value) || typeof value === "string") {
  showRecipe(key, value);
  history.pushState({}, "");
} else if (isObject(value)) {
  pathStack.push(key);
  titleEl.textContent = key;
  renderCategories(value);
  scrollToTop();
  history.pushState({}, "");
}
    });

    categoriesEl.appendChild(button);
  });
}

backBtn.addEventListener("click", () => {
if (!addRecipeView.classList.contains("hidden")) {
  currentCategory = null;
  pathStack = [];

  showHome();

  scrollToTop();
  return;
}

 if (!shoppingView.classList.contains("hidden")) {
  currentCategory = null;
  pathStack = [];

  showHome();

  scrollToTop();
  return;
}

  if (!recipeView.classList.contains("hidden")) {
    showCategories();
    titleEl.textContent =
      pathStack.length > 0
        ? pathStack[pathStack.length - 1]
        : currentCategory
        ? categoryMeta[currentCategory]?.title || currentCategory
        : "בחר קטגוריה";
    scrollToTop();
    return;
  }

  if (pathStack.length > 0) {
    pathStack.pop();
    titleEl.textContent =
      pathStack.length > 0
        ? pathStack[pathStack.length - 1]
        : categoryMeta[currentCategory]?.title || currentCategory;
    renderCategories(getNode());
    scrollToTop();
    return;
  }

 if (currentCategory) {
  currentCategory = null;

  titleEl.textContent = "קטגוריות";
  renderCategories(data);

  scrollToTop();
  return;
}

if (!categoriesEl.classList.contains("hidden")) {
  currentCategory = null;
  pathStack = [];

  showHome();

  scrollToTop();
  return;
}
});

async function loadShoppingList() {
  if (!canAccessShoppingList()) {
    shoppingList.textContent = "אין לך הרשאה לצפות ברשימת הקניות";
    return;
  }

  shoppingList.textContent = "טוען רשימה...";

  try {
    const snapshot = await window.firebaseGetDocs(
      window.firebaseCollection(window.firebaseDb, SHOPPING_COLLECTION)
    );

    const items = [];

    snapshot.forEach((docSnap) => {
      items.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    shoppingList.innerHTML = "";

    if (items.length === 0) {
      shoppingList.textContent = "הרשימה ריקה";
      return;
    }

    items.forEach((item) => {
  const div = document.createElement("div");
  div.className = "shopping-item-card";

  const icon = document.createElement("div");
  icon.className = "shopping-item-icon";
  icon.textContent = "🛍️";

  const texts = document.createElement("div");
  texts.className = "shopping-item-texts";

  const text = document.createElement("div");
  text.className = "shopping-item-name";
  text.textContent = item.text;

  const meta = document.createElement("div");
  meta.className = "shopping-item-meta";
  meta.textContent = item.createdBy
    ? `נוסף על ידי ${item.createdBy}`
    : "פריט ברשימה";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "shopping-delete-btn";
  deleteBtn.type = "button";
  deleteBtn.textContent = "🗑️";

  deleteBtn.addEventListener("click", () => {
    deleteShoppingItem(item.id);
  });

  texts.appendChild(text);
  texts.appendChild(meta);

  div.appendChild(icon);
  div.appendChild(texts);
  div.appendChild(deleteBtn);

  shoppingList.appendChild(div);
});
    
  } catch (error) {
    shoppingList.textContent = "שגיאה בטעינת הרשימה";
    console.log(error);
  }
}
async function saveNewRecipe() {
  const category = newRecipeCategory.value;
  const subcategory = newRecipeSubcategory.value.trim();
  const title = newRecipeTitle.value.trim();
  const content = newRecipeContent.value.trim();

  if (!canAddRecipe()) {
    alert("אין לך הרשאה לשמור מתכון");
    return;
  }

  if (!title || !content) {
    alert("יש למלא שם מתכון ותוכן");
    return;
  }

  if (editingRecipeId) {
    try {
      await window.firebaseSetDoc(
        window.firebaseDoc(window.firebaseDb, "recipes", editingRecipeId),
        {
          category,
          subcategory,
          title,
          content,
          updatedAt: new Date().toISOString(),
          updatedBy: getUsername()
        },
        { merge: true }
      );

      editingRecipeId = null;
      editingRecipeCategory = null;

      saveNewRecipeBtn.textContent = "שמור מתכון";
      addRecipeStatus.textContent = "המתכון עודכן בהצלחה ✔";

      newRecipeSubcategory.value = "";
      newRecipeTitle.value = "";
      newRecipeContent.value = "";

      await loadRecipes();

      currentCategory = category;
      pathStack = subcategory ? [subcategory] : [];
      titleEl.textContent = subcategory || categoryMeta[category]?.title || category;
      renderCategories(getNode());
      scrollToTop();

      alert("המתכון עודכן בהצלחה");
      return;
    } catch (error) {
      addRecipeStatus.textContent = "שגיאה בעדכון המתכון";
      console.log(error);
      return;
    }
  }

const existingCategoryData = data?.[category] || {};

if (
  subcategory &&
  typeof existingCategoryData[subcategory] === "string"
) {
  alert(
    `"${subcategory}" הוא מתכון קיים ולא תת־קטגוריה.\n` +
    "אם אתה רוצה לעדכן אותו, צריך להשתמש בעריכת מתכון."
  );
  return;
}
  
  try {
    await window.firebaseAddDoc(
      window.firebaseCollection(window.firebaseDb, "recipes"),
      {
        category,
        subcategory,
        title,
        content,
        createdAt: new Date().toISOString(),
        createdBy: getUsername()
      }
    );

   addRecipeStatus.textContent = "המתכון נשמר בהצלחה ✔";

newRecipeSubcategory.value = "";
newRecipeTitle.value = "";
newRecipeContent.value = "";

await loadRecipes();

currentCategory = category;
pathStack = [];
titleEl.textContent = categoryMeta[category]?.title || category;
renderCategories(data[category]);
scrollToTop();

alert("המתכון נוסף בהצלחה");
  } catch (error) {
    addRecipeStatus.textContent = "שגיאה בשמירת המתכון";
    console.log(error);
  }
}

async function addShoppingItem() {
  if (!canAccessShoppingList()) {
    alert("אין לך הרשאה לעדכן את רשימת הקניות");
    return;
  }

  const item = shoppingInput.value.trim();

  if (!item) return;

  await window.firebaseAddDoc(
    window.firebaseCollection(window.firebaseDb, SHOPPING_COLLECTION),
    {
      text: item,
      createdBy: getUsername(),
      createdAt: new Date().toISOString()
    }
  );

  shoppingInput.value = "";
  loadShoppingList();
}

async function deleteShoppingItem(id) {
  if (!canAccessShoppingList()) {
    alert("אין לך הרשאה לעדכן את רשימת הקניות");
    return;
  }

  await window.firebaseDeleteDoc(
    window.firebaseDoc(window.firebaseDb, SHOPPING_COLLECTION, id)
  );

  loadShoppingList();
}

if (addShoppingItemBtn) {
  addShoppingItemBtn.addEventListener("click", addShoppingItem);
}
if (saveUsernameBtn) {
  saveUsernameBtn.addEventListener("click", saveUsername);
}

if (saveNewRecipeBtn) {
  saveNewRecipeBtn.addEventListener("click", saveNewRecipe);
}

function openAddRecipeScreen() {

  if (!canAddRecipe()) {
    alert("אין לך הרשאה להוסיף מתכון");
    return;
  }

  editingRecipeId = null;
  editingRecipeCategory = null;

  saveNewRecipeBtn.textContent = "שמור מתכון";
  addRecipeStatus.textContent = "";

  newRecipeSubcategory.value = "";
  newRecipeTitle.value = "";
  newRecipeContent.value = "";

  hideAllViews();

  addRecipeView.classList.remove("hidden");

  titleEl.textContent = "הוסף מתכון";

  scrollToTop();

  history.pushState({}, "");
}

if (addRecipeBtn) {
  addRecipeBtn.addEventListener("click", openAddRecipeScreen);
}

if (addRecipeHomeBtn) {
  addRecipeHomeBtn.addEventListener("click", openAddRecipeScreen);
}

function openRecipesScreen() {
  currentCategory = null;
  pathStack = [];

  titleEl.textContent = "קטגוריות";

  renderCategories(data);

  scrollToTop();

  history.pushState({}, "");
}

if (recipesHomeBtn) {
  recipesHomeBtn.addEventListener("click", openRecipeOfDay);
}

if (recipesHomeBtn2) {
  recipesHomeBtn2.addEventListener("click", openRecipesScreen);
}

if (shoppingBtn) {
  shoppingBtn.addEventListener("click", () => {
    if (!canAccessShoppingList()) {
      alert("אין לך הרשאה לגשת לרשימת הקניות");
      return;
    }

    currentCategory = null;
    pathStack = [];

    hideAllViews();

    if (mainTopbar) {
      mainTopbar.classList.remove("hidden");
    }

    shoppingView.classList.remove("hidden");

    titleEl.textContent = "רשימת קניות";

    loadShoppingList();

    scrollToTop();

    history.pushState({}, "");
  });
}

if (shoppingHomeBtn) {
  shoppingHomeBtn.addEventListener("click", () => {

    hideAllViews();

    if (mainTopbar) {
      mainTopbar.classList.remove("hidden");
    }

    shoppingView.classList.remove("hidden");

    titleEl.textContent = "רשימת קניות";

    loadShoppingList();

    scrollToTop();

    history.pushState({}, "");
  });
}

    hideAllViews();

    shoppingView.classList.remove("hidden");

    titleEl.textContent = "רשימת קניות";

    loadShoppingList();

    scrollToTop();

    history.pushState({}, "");
  });
}

function openRecipeOfDay() {
  if (!window.recipeOfDay) {
    openRecipesScreen();
    return;
  }

  showRecipe(
    window.recipeOfDay.title,
    window.recipeOfDay.data
  );

  history.pushState({}, "");
}

async function loadRecipes() {
  try {
    titleEl.textContent = "טוען מתכונים...";

    const snapshot = await window.firebaseGetDocs(
      window.firebaseCollection(window.firebaseDb, "recipes")
    );

    const recipes = {};

    snapshot.forEach((doc) => {
      const recipe = doc.data();
      const recipeId = doc.id;

      const category = recipe.category;
      const subcategory = recipe.subcategory;
      const title = recipe.title;
      const content = recipe.content;

      if (!recipes[category]) {
        recipes[category] = {};
      }

      if (subcategory) {
        if (!recipes[category][subcategory]) {
          recipes[category][subcategory] = {};
        }

    recipes[category][subcategory][title] = {
  title,
  content,
  id: recipeId
};
      } else {
recipes[category][title] = {
  title,
  content,
  id: recipeId
};
      }
    });

    window.data = recipes;

    renderCategories(data);
    checkUsername();

  } catch (error) {
    titleEl.textContent = "שגיאה בטעינת המתכונים";
    console.log(error);
  }
}

window.addEventListener("firebaseReady", () => {
  loadRecipes();
});


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => console.log("Service Worker registered"))
      .catch((error) =>
        console.log("Service Worker registration failed:", error)
      );
  });
}

window.addEventListener("popstate", () => {
  backBtn.click();
});
