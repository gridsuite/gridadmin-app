// https://github.com/microsoft/TypeScript/issues/29729#issuecomment-505826972
//TODO use version of type-fest instead?
export type LiteralUnion<
    Literals,
    Base extends string | number | boolean | bigint = string
> = Literals | (Base & Record<never, never>);
