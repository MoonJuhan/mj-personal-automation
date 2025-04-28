const { topic, message } = $input.first().json.body;

return { isDone: topic === "Print Done", message };
