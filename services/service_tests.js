import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import {  } from './service.js';

Deno.test("Function getHello returns empty string when nothing has been set", () => {
    assertEquals(getHello(), '');
});

Deno.test("setHello without message", () => {
    setHello();
    assertEquals(getHello(), '');
});

Deno.test("Too long message", () => {
    setHello('liian pitkä viesti :DDDDDDDDDDD');
    assertEquals(getHello(), '');
});

Deno.test("Message set using setHello returned from getHello", () => {
    setHello('Moi!');
    assertEquals(getHello(), 'Moi!');
});
