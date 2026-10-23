// Общая модель комнаты. Логика участников и синхронизации появится позже.
#[allow(dead_code)]
pub struct Room<T> {
    pub id: String,
    pub state: T,
}
