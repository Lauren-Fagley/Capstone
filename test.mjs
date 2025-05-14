// esm-test.mjs
import { Dragoneye } from "dragoneye-node"
//const { Dragoneye } = require("dragoneye-node");
const dragoneyeClient = new Dragoneye({
  apiKey: "6JJClVKMn2qxACuK35qNQbbOlti-AolUpSRs6ZxEpqCos-4XQQ7kW5Mt4UMqLATkPbSC405Vocmx8-QQyt0A9aolCQN2q9OoX6pgSXoNkhtx5Of_u1SA2hxwFCCur1sl-5bEXwH5EvYAPW68qTnutVWpZY1M6wHHzKNKcXl_ZCs="
});

const runTest = async () => {
  try {
    const result = await dragoneyeClient.classification.predict({
      image: {
        url: "https://www.eptrail.com/wp-content/uploads/migration/2018/0703/20180703_06EIORMNP-2.jpg"
      },
      modelName: "dragoneye/animal"
    });
    console.log("Prediction result:", result);
  } catch (err) {
    console.error("Dragoneye test failed:", err);
  }
};

runTest();