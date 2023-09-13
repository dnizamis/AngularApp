import {Recipe} from "./recipe.model";
import {EventEmitter, Injectable} from "@angular/core";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shoping-list.service";
import {Subject} from "rxjs";


@Injectable()
export class RecipeService{
  recipesChanged = new Subject<Recipe[]>;
  private recipes: Recipe[] = [];
    // new Recipe('A Test Recipe',
    //   'Test Description',
    //   'https://cdn.pixabay.com/photo/2023/05/31/11/15/fish-8031138_1280.jpg',
    //   [
    //   new Ingredient('Fish',1),
    //   new Ingredient('Vegetables',3),
    //   ]),
    //
    // new Recipe('Second Recipe',
    //   ' Second Test Description',
    //   'https://cdn.pixabay.com/photo/2023/05/31/11/15/fish-8031138_1280.jpg',
    //   [
    //     new Ingredient('Fish',2),
    //     new Ingredient('Potatoes',5)
    //   ])
  // ];

  constructor(private slService: ShoppingListService ) {
  }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes(){
    return this.recipes.slice();
  }

  getRecipe(index: number){
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number ,newrecipe: Recipe){
      this.recipes[index] = newrecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index,1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
