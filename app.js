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
const categoriesEl = document.getElementById("categories");
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

const SHOPPING_API_URL = "https://script.google.com/macros/s/AKfycbzJ4koLQ0XOjNr6fUl_T_CFgcTqnnWU4cCqnZLQjvqOYY9LABJJrl2IB3G6cujfWPhs/exec";

const SHOPPING_ALLOWED_USERS = ["גיא", "מוניקה", "ליאן", "אמה"];

let currentCategory = null;
let pathStack = [];

function getUsername() {
  return localStorage.getItem("recipeAppUsername") || "";
}

function canAccessShoppingList() {
  return SHOPPING_ALLOWED_USERS.includes(getUsername());
}

function saveUsername() {
  const username = usernameInput.value.trim();

  if (!username) return;

  localStorage.setItem("recipeAppUsername", username);
  userView.classList.add("hidden");
  categoriesEl.classList.remove("hidden");
  titleEl.textContent = `שלום ${username}`;
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
  categoriesEl.classList.remove("hidden");
  titleEl.textContent = `שלום ${username}`;
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function hideAllViews() {
  categoriesEl.classList.add("hidden");
  recipeView.classList.add("hidden");
  shoppingView.classList.add("hidden");
  addRecipeView.classList.add("hidden");
}

function showCategories() {
  categoriesEl.classList.remove("hidden");
  recipeView.classList.add("hidden");
  shoppingView.classList.add("hidden");
  addRecipeView.classList.add("hidden");
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

  function collectRecipes(node) {
    if (!node) return;

    Object.entries(node).forEach(([key, value]) => {
      if (typeof value === "string") {
        examples.push(key);
        return;
      }

      if (isObject(value)) {
        collectRecipes(value);
      }
    });
  }

  collectRecipes(categoryData);

  return examples.slice(0, 3).join(" · ");
}

function showRecipe(name, content) {
  hideAllViews();
  recipeView.classList.remove("hidden");
recipeTitle.textContent = name;

recipeContent.innerHTML =
  (content && content.replace(/\n/g, "<br>")) ||
  "עדיין לא הוזן מתכון לפריט הזה";

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
      desc: isObject(value) ? "פתח תת-קטגוריה" : "פתח מתכון",
      icon: getIcon(key, value),
      className: ""
    };

console.log("icon check:", key, meta.icon);

    const button = document.createElement("button");
    button.className = `category ${meta.className}`.trim();
    button.type = "button";

    const descText = !currentCategory
      ? getRecipeExamples(value) || meta.desc
      : meta.desc;
    
        button.innerHTML = `
      <div class="category-right">
        <div class="category-icon">${meta.icon}</div>
        <div class="category-texts">
          <div class="category-title">${meta.title}</div>
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

      if (isObject(value)) {
        pathStack.push(key);
        titleEl.textContent = key;
        renderCategories(value);
        scrollToTop();
        history.pushState({}, "");
      } else {
        showRecipe(key, value);
        history.pushState({}, "");
      }
    });

    categoriesEl.appendChild(button);
  });
}

backBtn.addEventListener("click", () => {
  if (!shoppingView.classList.contains("hidden")) {
    currentCategory = null;
    pathStack = [];
    titleEl.textContent = "בחרי קטגוריה";
    renderCategories(data);
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
    titleEl.textContent = "בחר קטגוריה";
    renderCategories(data);
    scrollToTop();
  }
});

async function loadShoppingList() {
  shoppingList.textContent = "טוען רשימה...";

  try {
    const response = await fetch(SHOPPING_API_URL);
    const items = await response.json();

    shoppingList.innerHTML = "";

    if (items.length === 0) {
      shoppingList.textContent = "הרשימה ריקה";
      return;
    }

items.forEach((item) => {
  const div = document.createElement("div");
  div.className = "shopping-item";

  const text = document.createElement("span");
  text.textContent = item.item;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "shopping-delete-btn";
  deleteBtn.textContent = "🗑️";
  deleteBtn.addEventListener("click", () => {
    deleteShoppingItem(item.id);
  });

  div.appendChild(text);
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

  if (!title || !content) {
    alert("יש למלא שם מתכון ותוכן");
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
  } catch (error) {
    addRecipeStatus.textContent = "שגיאה בשמירת המתכון";
    console.log(error);
  }
}

async function addShoppingItem() {
  const item = shoppingInput.value.trim();

  if (!item) return;

  await fetch(SHOPPING_API_URL, {
    method: "POST",
    body: JSON.stringify({ item })
  });

  shoppingInput.value = "";
  loadShoppingList();
}

async function deleteShoppingItem(id) {
  await fetch(SHOPPING_API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "delete",
      id: id
    })
  });

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

if (addRecipeBtn) {
  addRecipeBtn.addEventListener("click", () => {
    hideAllViews();
    addRecipeView.classList.remove("hidden");
    titleEl.textContent = "הוסף מתכון";
    scrollToTop();
    history.pushState({}, "");
  });
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
    shoppingView.classList.remove("hidden");
    titleEl.textContent = "רשימת קניות";
    loadShoppingList();
    scrollToTop();
    history.pushState({}, "");
  });
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

        recipes[category][subcategory][title] = content;
      } else {
        recipes[category][title] = content;
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
