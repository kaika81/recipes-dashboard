const importBtn = document.getElementById("importBtn");
const statusEl = document.getElementById("status");

function makeRecipeId(category, subcategory, title) {
  return `${category}_${subcategory || "none"}_${title}`
    .replace(/\s+/g, "_")
    .replace(/[^\u0590-\u05FFa-zA-Z0-9_]/g, "");
}

function flattenRecipes(data) {
  const recipes = [];

  Object.entries(data).forEach(([category, categoryValue]) => {
    Object.entries(categoryValue).forEach(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const subcategory = key;

        Object.entries(value).forEach(([title, content]) => {
          recipes.push({
            category,
            subcategory,
            title,
            content: content || ""
          });
        });
      } else {
        recipes.push({
          category,
          subcategory: "",
          title: key,
          content: value || ""
        });
      }
    });
  });

  return recipes;
}

async function importRecipes() {
  statusEl.textContent = "טוען recipes.json...";

  try {
    const response = await fetch("./recipes.json");
    const data = await response.json();

    const recipes = flattenRecipes(data);

    statusEl.textContent = `נמצאו ${recipes.length} מתכונים. מתחיל ייבוא...`;

    for (const recipe of recipes) {
      const id = makeRecipeId(
        recipe.category,
        recipe.subcategory,
        recipe.title
      );

      await window.firebaseSetDoc(
        window.firebaseDoc(window.firebaseDb, "recipes", id),
        {
          ...recipe,
          updatedAt: new Date().toISOString(),
          imported: true
        }
      );
    }

    statusEl.textContent = `הייבוא הסתיים בהצלחה ✔\nיובאו ${recipes.length} מתכונים.`;
  } catch (error) {
    statusEl.textContent = "שגיאה בייבוא המתכונים";
    console.log(error);
  }
}

window.addEventListener("firebaseReady", () => {
  importBtn.addEventListener("click", importRecipes);
});