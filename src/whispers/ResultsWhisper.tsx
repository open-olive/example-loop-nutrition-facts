import React from "react";
import "@oliveai/ldk";
import {
  AlignItems,
  Direction,
  IconSize,
  JustifyContent,
  StyleSize,
  TextAlign,
  Urgency,
} from "@oliveai/ldk/dist/whisper";
import { WhisperInstance } from "@oliveai/ldk/dist/whisper/react/whisper-instance-wrapper";
import * as ReactWhisper from "@oliveai/ldk/dist/whisper/react/renderer";

interface ResultsProps {
  foods: Array<any>;
  selectFoodForNutritionFacts: (food: any) => void;
}

const Results: React.FunctionComponent<ResultsProps> = (
  props: ResultsProps
) => {
  const { foods, selectFoodForNutritionFacts } = props;
  let options = [];

  for (let i = 0; i < foods.length; i++) {
    const { brandName, brandOwner, description, ingredients } = foods[i];
    options.push(
      <>
        <oh-box
          direction={Direction.Horizontal}
          justifyContent={JustifyContent.Left}
          alignItems={AlignItems.Center}
        >
          <oh-icon
            name="info"
            size={IconSize.Medium}
            tooltip={"Select option"}
            onClick={() => {
              selectFoodForNutritionFacts(foods[i]);
            }}
          />
          <oh-box
            direction={Direction.Vertical}
            justifyContent={JustifyContent.Left}
          >
            <oh-list-pair
              copyable={false}
              label="Description"
              style={Urgency.None}
              value={`${description || "N/A"}`}
            />
            {brandName && (
              <oh-list-pair
                copyable={false}
                label="Brand Name"
                style={Urgency.None}
                value={`${brandName}`}
              />
            )}
            <oh-list-pair
              copyable={false}
              label="Brand Owner"
              style={Urgency.None}
              value={`${brandOwner || "N/A"}`}
            />
          </oh-box>
        </oh-box>
        <oh-link
          text="Select"
          textAlign={TextAlign.Right}
          onClick={() => selectFoodForNutritionFacts(foods[i])}
        />
        <oh-divider
          layout={{
            marginBottom: StyleSize.Medium,
            marginTop: StyleSize.Medium,
          }}
        />
      </>
    );
  }

  return (
    <oh-whisper
      label="USDA Product Nutritional Data - Results"
      onClose={() => {}}
    >
      <>{options}</>
    </oh-whisper>
  );
};

export default class ResultsWhisper {
  foods?: any;

  selectFoodForNutritionFacts: (food: any) => void;

  whisper: WhisperInstance;

  constructor(foods: any, selectFoodForNutritionFacts: any) {
    this.foods = foods;
    this.whisper = undefined;
    this.selectFoodForNutritionFacts = selectFoodForNutritionFacts;
  }

  show() {
    ReactWhisper.renderNewWhisper(
      <Results
        foods={this.foods}
        selectFoodForNutritionFacts={this.selectFoodForNutritionFacts}
      />
    ).then((newWhisper) => {
      this.whisper = newWhisper;
    });
  }

  close() {
    this.whisper.close();
  }
}
