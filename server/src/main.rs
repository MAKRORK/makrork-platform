mod core;
mod modules;
mod state;

use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/api/health", get(|| async { "OK" }))
        .nest("/api/teampix", modules::teampix::routes::router());

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .expect("Failed to bind TCP listener");

    println!("API listening on http://127.0.0.1:3000");
    axum::serve(listener, app).await.expect("Server error");
}
