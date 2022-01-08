import React from "react";
import "@oliveai/ldk";
import {
  AlignItems,
  ButtonStyle,
  Direction,
  JustifyContent,
  ProgressShape,
  StyleSize,
} from "@oliveai/ldk/dist/whisper";
import { WhisperInstance } from "@oliveai/ldk/dist/whisper/react/whisper-instance-wrapper";
import * as ReactWhisper from "@oliveai/ldk/dist/whisper/react/renderer";

interface InitialProps {
  submitForm: (product: string) => void;
}

const InitialForm: React.FunctionComponent<InitialProps> = (props) => {
  const { submitForm } = props;
  const [product, setProduct] = React.useState("");

  // Timeouts are needed to make sure that some inputs render correctly
  // on slower machines
  let t = setTimeout(() => {
    // do nothing
  }, 0);

  const submit = () => {
    if (product !== "") {
      submitForm(product);
    }
  };

  return (
    <oh-whisper label="USDA Product Nutritional Data" onClose={() => {}}>
      <>
        <oh-box
          direction={Direction.Vertical}
          justifyContent={JustifyContent.Left}
        >
          <oh-markdown
            body={`This loop leverages the USDA public API to retrieve nutritional information about different food products. Provide a product name to get started (like "Apple")`}
          />
          <oh-divider
            layout={{
              marginBottom: StyleSize.Medium,
              marginTop: StyleSize.Medium,
            }}
          />
          <oh-text-input
            label="Product"
            onChange={(_, val) => {
              clearTimeout(t);
              t = setTimeout(() => {
                setProduct(val);
              }, 500);
            }}
            value={product}
          />
          <oh-box
            direction={Direction.Horizontal}
            justifyContent={JustifyContent.SpaceBetween}
            layout={{ marginTop: StyleSize.Medium }}
          >
            <oh-button
              label={"Clear"}
              buttonStyle={ButtonStyle.Secondary}
              onClick={(error, whisperProps) => {
                setProduct("");
              }}
            />
            <oh-button
              label={"Submit"}
              onClick={(error, whisperProps) => {
                submit();
              }}
            />
          </oh-box>
        </oh-box>
        <oh-markdown body={`${product}`} />
      </>
    </oh-whisper>
  );
};

export default class IntroWhisper {
  whisper: WhisperInstance;

  submitForm: (product: string) => void;

  constructor(submitForm: any) {
    this.whisper = undefined;
    this.submitForm = submitForm;
  }

  show() {
    ReactWhisper.renderNewWhisper(
      <InitialForm submitForm={this.submitForm} />
    ).then((newWhisper) => {
      this.whisper = newWhisper;
    });
  }

  close() {
    this.whisper.close();
  }
}
