
# Recipe Finder

Recipe Finder is a web application that utilizes the Forkify API to search for over 100,000 recipes and allows users to save their favorite recipes for later reference.


## Features
Users can search for recipes using keywords, ingredients, or recipe names, accessing a vast database of over 100,000 recipes.

Save Favorite Recipes: Once users find a recipe they love, they can save it to their profile for easy access later.

User Profiles: Each user has their own profile where they can view and manage their saved recipes.

## Tech Stack

-Forkify API: The backbone of the application, providing access to a vast collection of recipes.

-HTML/CSS/JavaScript: The frontend of the application is built using these technologies to create an intuitive and interactive user experience.

-Parcel.js: Express.js is used to build the RESTful API that connects the frontend to the backend.



## API Reference

#### Get all items

```http
  https://forkify-api.herokuapp.com/api/v2/recipes/
```

| Parameter | Required     | Description                |
| :-------- | :------- | :------------------------- |
| `search` | `Yes` | Search text. For example search=pizza|


```http
  GET https://forkify-api.herokuapp.com/api/v2/recipes/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `Yes` | The id of the recipe to be fetched or deleted (part of UR) |

```http
https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886?key=<insert your key>
```
## Screenshot

https://github.com/ahsanjaved850/Recipe-Finder/assets/135028201/38dcbe67-8ffe-408f-a110-fc4d64f4506b

## Contributing

Contributions are welcome! If you have any ideas for improvements or new features, feel free to open an issue or submit a pull request.


## Authors

- [@ahsanjaved850](https://github.com/ahsanjaved850/)


## Acknowledgements

-This project was inspired by the Forkify API, which provides access to a vast collection of recipes.

-Special thanks to the developers of Forkify for creating such a valuable resource for food enthusiasts everywhere.

