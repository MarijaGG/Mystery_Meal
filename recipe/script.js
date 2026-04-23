async function searchRecipes() {
    try {
        const input = document.getElementById("ingredients").value;

        // format multiple ingredients (milk, eggs → milk,eggs)
        const formattedIngredients = input
            .split(",")
            .map(i => i.trim())
            .filter(i => i !== "")
            .join(",");

        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        // ❌ empty input
        if (!formattedIngredients) {
            resultsDiv.innerHTML = "<p>Please enter at least one ingredient ❗</p>";
            return;
        }

        const response = await fetch(
            "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" 
            + encodeURIComponent(formattedIngredients) +
            "&number=8" +
            "&apiKey=83152f20076d44948c591f4e96ea801e"
        );

        const data = await response.json();

        // ❌ no recipes
        if (!data || data.length === 0) {
            resultsDiv.innerHTML = "<p>No recipes found ❌</p>";
            return;
        }

        // count how many ingredients user entered
        const ingredientCount = formattedIngredients.split(",").length;

        // split recipes
        const fullMatch = data.filter(recipe => 
            recipe.usedIngredientCount === ingredientCount
        );

        const partialMatch = data.filter(recipe => 
            recipe.usedIngredientCount < ingredientCount
        );

        // render function
    function renderRecipes(recipes, title) {
    if (recipes.length === 0) return;

    const section = document.createElement("div");
    section.className = "section";

    const sectionTitle = document.createElement("h2");
    sectionTitle.textContent = title;

    const container = document.createElement("div");
    container.className = "card-container";

    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>

            <p><strong>Used ingredients:</strong><br>
            ${recipe.usedIngredients.map(i => i.name).join(", ")}</p>

            <p><strong>AI suggestion:</strong></p>
            <ul>
                ${recipe.missedIngredients.map(i => `<li>${i.name}</li>`).join("")}
            </ul>
        `;

        container.appendChild(card);
    });

    section.appendChild(sectionTitle);
    section.appendChild(container);
    resultsDiv.appendChild(section);
}

        // render both groups
        renderRecipes(fullMatch, "✅ Recipes with ALL your ingredients");
        renderRecipes(partialMatch, "⚠️ Recipes with SOME of your ingredients");

    } catch (error) {
        console.error("Error:", error);
    }
}