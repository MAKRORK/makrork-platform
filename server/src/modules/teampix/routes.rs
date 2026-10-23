use axum::{routing::get, Router};

// Пока только тестовый endpoint. Позже здесь появятся маршруты комнат.
pub fn router() -> Router {
    Router::new().route("/status", get(|| async { "teampix API ready" }))
}
