use super::Room;

// Заготовка для универсального менеджера комнат.
#[allow(dead_code)]
pub struct RoomManager<T> {
    _marker: std::marker::PhantomData<Room<T>>,
}

impl<T> Default for RoomManager<T> {
    fn default() -> Self {
        Self { _marker: std::marker::PhantomData }
    }
}
