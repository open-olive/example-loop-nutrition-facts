import React from "react";
import "@oliveai/ldk";
import {
  AlignItems,
  ButtonStyle,
  Color,
  Direction,
  JustifyContent,
  ProgressShape,
  StyleSize,
} from "@oliveai/ldk/dist/whisper";
import { WhisperInstance } from "@oliveai/ldk/dist/whisper/react/whisper-instance-wrapper";
import * as ReactWhisper from "@oliveai/ldk/dist/whisper/react/renderer";

interface InitialProps {
  food: any;
}

const NutritionData: React.FunctionComponent<InitialProps> = (props) => {
  const { food } = props;
  const { packageWeight, servingSize, servingSizeUnit } = food;

  const getNutrientComponent = (
    label: string,
    nutrient: any,
    indent: boolean,
    extraNutrient: boolean
  ) => {
    /*
        - Indent Level 1 indicates a root item
        - Percent daily value is not guarenteed
    */
    return (
      <oh-box
        direction={Direction.Horizontal}
        justifyContent={JustifyContent.SpaceBetween}
        alignItems={AlignItems.FlexStart}
        layout={{
          marginLeft: indent ? StyleSize.Medium : StyleSize.None,
        }}
      >
        <oh-markdown
          body={`${indent || extraNutrient ? label : `**${label}**`} ${
            nutrient.value
          }${nutrient.unitName.toLowerCase()}`}
        />
        {typeof nutrient.percentDailyValue !== "undefined" && (
          <oh-markdown body={`**${nutrient.percentDailyValue}%**`} />
        )}
      </oh-box>
    );
  };

  const getNutrientFromId = (
    label: string,
    nutrientId: number,
    indent?: boolean,
    extraNutrient?: boolean
  ) => {
    const { foodNutrients } = food;
    const nutrient = foodNutrients.filter(
      (nutrient: any) => nutrient.nutrientId === nutrientId
    );

    let nutrientData = nutrient.length >= 1 ? nutrient[0] : null;

    return (
      <>
        {nutrientData ? (
          getNutrientComponent(
            label,
            nutrientData,
            indent || false,
            extraNutrient || false
          )
        ) : (
          <></>
        )}
      </>
    );
  };

  const getFatStats = () => {
    return (
      <>
        {getNutrientFromId("Total Fat", 1004, false)}
        {getNutrientFromId("Saturated Fat", 1258, true)}
        {getNutrientFromId("Trans Fat", 1257, true)}
      </>
    );
  };

  const getCarbohydrateStats = () => {
    return (
      <>
        {getNutrientFromId("Total Carbohydrate", 1005, false)}
        {getNutrientFromId("Dietary Fiber", 1079, true)}
        {getNutrientFromId("Total Sugars", 2000, true)}
        {getNutrientFromId("Added Sugars", 1235, true)}
      </>
    );
  };

  const getOtherNutrients = () => {
    // Nutrient IDs already listed
    const { foodNutrients } = food;
    const additionalNutrients: any[] = [];
    const primaryNutrientIds = [
      1003, 1004, 1005, 1008, 1079, 1082, 1084, 1098, 1235, 1253, 1258, 1257,
      2000,
    ];

    const remainingNutrients = foodNutrients.filter(
      (nutrient: any) =>
        !primaryNutrientIds.includes(nutrient.nutrientId) &&
        nutrient.value !== 0
    );
    remainingNutrients.map((nutrient: any) => {
      additionalNutrients.push(
        getNutrientFromId(
          nutrient.nutrientName.split(",")[0],
          nutrient.nutrientId,
          false,
          true
        )
      );
      additionalNutrients.push(<oh-divider />);
    });

    return additionalNutrients;
  };

  const calories = food.foodNutrients.filter(
    (nutrient: any) => nutrient.nutrientId === 1008
  )[0];

  return (
    <oh-whisper
      label={`Nutritional Facts - ${food.description}`}
      onClose={() => {}}
    >
      <>
        {packageWeight && (
          <oh-box
            direction={Direction.Horizontal}
            justifyContent={JustifyContent.SpaceBetween}
            alignItems={AlignItems.FlexStart}
          >
            <oh-markdown body="**Package Weight**" />
            <oh-markdown body={`**${packageWeight}**`} />
          </oh-box>
        )}
        {servingSize && (
          <oh-box
            direction={Direction.Horizontal}
            justifyContent={JustifyContent.SpaceBetween}
            alignItems={AlignItems.FlexStart}
          >
            <oh-markdown body="**Serving Size**" />
            <oh-markdown body={`**${servingSize}${servingSizeUnit}**`} />
          </oh-box>
        )}
        <oh-section-title body=" " backgroundStyle={Color.Grey} />
        <oh-box
          direction={Direction.Horizontal}
          justifyContent={JustifyContent.SpaceBetween}
          alignItems={AlignItems.FlexStart}
        >
          <oh-markdown body="# Calories" />
          <oh-markdown body={`# ${calories.value}`} />
        </oh-box>
        <oh-section-title body=" " backgroundStyle={Color.Grey} />
        <oh-box
          direction={Direction.Horizontal}
          justifyContent={JustifyContent.Right}
        >
          <oh-markdown body="% Daily Value*" />
        </oh-box>

        <oh-divider />
        {getFatStats()}
        <oh-divider />
        {getNutrientFromId("Cholesterol", 1253)}
        <oh-divider />
        {getNutrientFromId("Sodium", 1093)}
        <oh-divider />
        {getCarbohydrateStats()}
        <oh-divider />
        {getNutrientFromId("Protein", 1003)}
        <oh-section-title body=" " backgroundStyle={Color.Grey} />
        {getOtherNutrients()}
      </>
    </oh-whisper>
  );
};

export default class NutritionDataWhisper {
  whisper: WhisperInstance;

  food: any;

  constructor(food: any) {
    this.whisper = undefined;
    this.food = food;
  }

  show() {
    ReactWhisper.renderNewWhisper(<NutritionData food={this.food} />).then(
      (newWhisper) => {
        this.whisper = newWhisper;
      }
    );
  }

  close() {
    this.whisper.close();
  }
}
