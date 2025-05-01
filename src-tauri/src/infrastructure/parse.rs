pub trait Parse<T>: Sized {
    type Error;
    fn parse(value: T) -> Result<Self, Self::Error>;
}
