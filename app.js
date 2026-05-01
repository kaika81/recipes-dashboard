const categoryMeta = {
  main: {
    title: "00מנה עיקרית",
    desc: "מנות בשר, עוף, דגים ותבשילים",
    icon: "🍗",
    className: "main"
  },
  side: {
    title: "תוספת",
    desc: "אורז, תפוחי אדמה, ירקות ועוד",
    icon: "🍚",
    className: "side"
  },
  dessert: {
    title: "קינוח",
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
  },
  shopping: {
    title: "רשימת קניות",
    desc: "רשימה משותפת לכל המשפחה",
    icon: "🛒",
    className: "shopping"
  }
};

const titleEl = document.getElementById("title");
const categoriesEl = document.getElementById("categories");
const backBtn = document.getElementById("backBtn");
const recipeView = document.getElementById("recipeView");
const recipeTitle = document.getElementById("recipeTitle");
const recipeContent = document.getElementById("recipeContent");

const shoppingView = document.getElementById("shoppingView");
const shoppingInput = document.getElementById("shoppingInput");
const addShoppingItemBtn = document.getElementById("addShoppingItem");
const shoppingList = document.getElementById("shoppingList");

const SHOPPING_API_URL = "https://script.google.com/macros/s/AKfycbzJ4koLQ0XOjNr6fUl_T_CFgcTqnnWU4cCqnZLQjvqOYY9LABJJrl2IB3G6cujfWPhs/exec";

let currentCategory = null;
let pathStack = [];

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
}

function showCategories() {
  categoriesEl.classList.remove("hidden");
  recipeView.classList.add("hidden");
  shoppingView.classList.add("hidden");
}

function getNode() {
  let node = currentCategory ? data[currentCategory] : data;

  for (const step of pathStack) {
    node = node[step];
  }

  return node || {};
}

function getIcon(key, value) {
  if (isObject(value)) {
    if (key.includes("אורז")) return "🍚";
    if (key.includes("פסטה")) return "🍝";
    if (key.includes("סלט")) return "🥗";
    if (key.includes("קינוח")) return "🍰";
    if (key.includes("בשר")) return "🥩";
    if (key.includes("דג")) return "🐟";
    if (key.includes("עוף")) return "🍗";
    return "📁";
  }

  if (key.includes("עוף")) return "🍗";
  if (key.includes("המבורגר")) return "🍔";
  if (key.includes("סטייק")) return "🥩";
  if (key.includes("צלי")) return "🥩";
  if (key.includes("דג")) return "🐟";
  if (key.includes("סלמון")) return "🐟";
  if (key.includes("פסטה")) return "🍝";
  if (key.includes("אורז")) return "🍚";
  if (key.includes("סלט")) return "🥗";
  if (key.includes("עוגה")) return "🍰";
  if (key.includes("קינוח")) return "🍰";
  if (key.includes("חצ׳פורי")) return "🧀";
  if (key.includes("בטטה")) return "🍠";
  if (key.includes("תפוח")) return "🥔";

  return "🍽️";
}

function showRecipe(name, content) {
  hideAllViews();
  recipeView.classList.remove("hidden");
  recipeTitle.textContent = name;
  recipeContent.textContent = content || "עדיין לא הוזן מתכון לפריט הזה";
  titleEl.textContent = name;
  scrollToTop();
}

function renderCategories(node) {
  categoriesEl.innerHTML = "";
  showCategories();

  const entries = Object.entries(node || {});

  entries.forEach(([key, value]) => {
    const meta = !currentCategory && categoryMeta[key]
      ? categoryMeta[key]
      : {
          title: key,
          desc: isObject(value) ? "פתח תת-קטגוריה" : "פתח מתכון",
          icon: getIcon(key, value),
          className: ""
        };

    const button = document.createElement("button");
    button.className = `category ${meta.className}`.trim();
    button.type = "button";

    button.innerHTML = `
      <div class="category-right">
        <div class="category-icon">${meta.icon}</div>
        <div class="category-texts">
          <div class="category-title">${meta.title}</div>
          <div class="category-desc">${meta.desc}</div>
        </div>
      </div>
      <div class="category-arrow">›</div>
    `;

    button.addEventListener("click", () => {
      if (key === "shopping" && !currentCategory) {
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
    titleEl.textContent = "בחר קטגוריה";
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
      div.textContent = item.item;
      shoppingList.appendChild(div);
    });
  } catch (error) {
    shoppingList.textContent = "שגיאה בטעינת הרשימה";
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

if (addShoppingItemBtn) {
  addShoppingItemBtn.addEventListener("click", addShoppingItem);
}

if (typeof data === "undefined") {
  titleEl.textContent = "שגיאה בטעינת המתכונים";
} else {
  titleEl.textContent = "בחר קטגוריה";
  renderCategories(data);
}

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
