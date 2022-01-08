import { IntroWhisper, NutritionDataWhisper, ResultsWhisper } from "./whispers";
import { getNutritionData } from "./aptitudes";

(async function main(): Promise<void> {
  console.log("Nutrition Facts Loop Started");
  let introWhisper: IntroWhisper = null;
  let nutritionDataWhisper: NutritionDataWhisper = null;
  let resultWhisper: ResultsWhisper = null;

  // Submit function for the IntroWhisper
  const submitIntroForm = async (product: string) => {
    console.log("Submitted the following data: ", product);
    const foods = await getNutritionData(product);
    introWhisper.close();
    resultWhisper = new ResultsWhisper(foods, selectFoodForNutritionFacts);
    resultWhisper.show();
  };

  const selectFoodForNutritionFacts = (food: any) => {
    console.log("Selected to following rule: ", food.description);
    resultWhisper.close();
    nutritionDataWhisper = new NutritionDataWhisper(food);
    nutritionDataWhisper.show();
  };

  // Open the whisper on Loop Load
  introWhisper = new IntroWhisper(submitIntroForm);
  introWhisper.show();
})();
