const categoryMeta = {
  main: {
    title: "מנה עיקרית",
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
  }
};

const titleEl = document.getElementById("title");
const categoriesEl = document.getElementById("categories");
const backBtn = document.getElementById("backBtn");
const recipeView = document.getElementById("recipeView");
const recipeTitle = document.getElementById("recipeTitle");
const recipeContent = document.getElementById("recipeContent");

let currentCategory = null;
let pathStack = [];

function getNode() {
  let node = currentCategory ? data[currentCategory] : data;
  for (const step of pathStack) {
    node = node[step];
  }
  return node || {};
}

function isSubcategory(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function showRecipe(name, content) {
  categoriesEl.classList.add("hidden");
  recipeView.classList.remove("hidden");
  recipeTitle.textContent = name;
  recipeContent.textContent = content || "עדיין לא הוזן מתכון לפריט הזה";
  titleEl.textContent = name;
}

function hideRecipe() {
  recipeView.classList.add("hidden");
  categoriesEl.classList.remove("hidden");
}

function renderCategories(node) {
  categoriesEl.innerHTML = "";
  hideRecipe();

  const entries = Object.entries(node || {});

  entries.forEach(([key, value]) => {
    const meta =
      !currentCategory && categoryMeta[key]
        ? categoryMeta[key]
        : {
            title: key,
            desc: isSubcategory(value) ? "פתח תת-קטגוריה" : "פתח מתכון",
            icon: isSubcategory(value) ? "📁" : "🍽️",
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
      if (!currentCategory) {
        currentCategory = key;
        pathStack = [];
        titleEl.textContent = categoryMeta[key]?.title || key;
        renderCategories(data[key]);
        return;
      }

      if (isSubcategory(value)) {
        pathStack.push(key);
        titleEl.textContent = key;
        renderCategories(value);
      } else {
        showRecipe(key, value);
      }
    });

    categoriesEl.appendChild(button);
  });
}

backBtn.addEventListener("click", () => {
  if (!recipeView.classList.contains("hidden")) {
    hideRecipe();
    titleEl.textContent =
      pathStack.length > 0
        ? pathStack[pathStack.length - 1]
        : currentCategory
          ? categoryMeta[currentCategory]?.title || currentCategory
          : "בחר קטגוריה";
    return;
  }

  if (pathStack.length > 0) {
    pathStack.pop();
    titleEl.textContent =
      pathStack.length > 0
        ? pathStack[pathStack.length - 1]
        : categoryMeta[currentCategory]?.title || currentCategory;
    renderCategories(getNode());
    return;
  }

  if (currentCategory) {
    currentCategory = null;
    titleEl.textContent = "בחר קטגוריה";
    renderCategories(data);
  }
});

titleEl.textContent = "בחר קטגוריה";
renderCategories(data);