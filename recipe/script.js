async function searchRecipes() {
    try {
        const input = document.getElementById("ingredients").value;

        const formattedIngredients = input
            .split(",")
            .map(i => i.trim())
            .filter(i => i !== "")
            .join(",");

        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

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

        if (!data || data.length === 0) {
            resultsDiv.innerHTML = "<p>No recipes found ❌</p>";
            return;
        }

        const ingredientCount = formattedIngredients.split(",").length;

        const fullMatch = data.filter(r => r.usedIngredientCount === ingredientCount);
        const partialMatch = data.filter(r => r.usedIngredientCount < ingredientCount);

        renderRecipes(fullMatch, "✅ Recipes with ALL your ingredients", resultsDiv);
        renderRecipes(partialMatch, "⚠️ Recipes with SOME of your ingredients", resultsDiv);

    } catch (error) {
        console.error("Error:", error);
    }
}

function renderRecipes(recipes, title, resultsDiv) {
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

        const isFav = isFavorite(recipe.id);

        card.innerHTML = `
            <div class="fav-star ${isFav ? "active" : ""}" 
                 onclick='toggleFavorite(${JSON.stringify(recipe)}, this)'>
                ⭐
            </div>

            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>

            <p><strong>Used:</strong> 
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

function toggleFavorite(recipe, el) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const index = favorites.findIndex(r => r.id === recipe.id);

    if (index === -1) {
        favorites.push(recipe);
        alert("Added to favorites ⭐");
        el.classList.add("active");
    } else {
        favorites.splice(index, 1);
        alert("Removed from favorites ❌");
        el.classList.remove("active");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function isFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.some(r => r.id === id);
}

function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "<h2>⭐ Your Favorite Recipes</h2>";

    if (favorites.length === 0) {
        resultsDiv.innerHTML += "<p>No favorites yet</p>";
        return;
    }

    const container = document.createElement("div");
    container.className = "card-container";

    favorites.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "card";

        // combine ingredients nicely
        const allIngredients = [
            ...(recipe.usedIngredients || []),
            ...(recipe.missedIngredients || [])
        ];

        card.innerHTML = `
            <div class="fav-star active">⭐</div>

            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>

            <p><strong>Ingredients:</strong></p>
            <ul>
                ${allIngredients.map(i => `<li>${i.name}</li>`).join("")}
            </ul>
        `;

        container.appendChild(card);
    });

    resultsDiv.appendChild(container);
}