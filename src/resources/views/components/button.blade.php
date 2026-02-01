@props(['type' => 'button', 'variant' => 'primary'])

@php
$classes = match($variant) {
    'primary' => 'bg-gradient-to-r from-budgie-accent to-budgie-accent-2 text-white shadow-budgie hover:opacity-90',
    'secondary' => 'bg-white/5 text-budgie-text border border-white/10 hover:bg-white/10',
    default => 'bg-gradient-to-r from-budgie-accent to-budgie-accent-2 text-white shadow-budgie hover:opacity-90',
};
@endphp

<button
    type="{{ $type }}"
    {{ $attributes->merge(['class' => "px-4 py-2.5 rounded-full font-medium transition-all duration-200 {$classes}"]) }}
>
    {{ $slot }}
</button>
