import { network } from "@oliveai/ldk";
import { oneLine } from "common-tags";

const getNutritionData = async (product: string) => {
  const request: network.HTTPRequest = {
    method: "GET",
    url: oneLine`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
      product
    )}&pageSize=15&api_key=DEMO_KEY`,
  };

  console.log("Making URL request: " + request.url);

  const response = await network.httpRequest(request);
  const decodedBody = await network.decode(response.body);

  const results = JSON.parse(decodedBody);

  return results.foods;
};

export default getNutritionData;
