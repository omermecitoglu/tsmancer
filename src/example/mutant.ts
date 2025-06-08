class SimpleOperation {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  queryParams: Record<string, unknown>;
  body?: Record<string, unknown>;

  constructor(method: SimpleOperation["method"]) {
    this.method = method;
    this.queryParams = {};
  }

  query(params: unknown) {
    this.queryParams = params;
    return this;
  }

  execute() {
    return fetch(`/api/announcements/${announcementId}`, {
      method: this.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: this.body && JSON.stringify(this.body),
    });
  }
}

export class MutationOperation extends SimpleOperation {
  speak() {
    console.log(`${this.body} barks.`);
  }
}
