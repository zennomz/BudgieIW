@props(['padded' => true])

@php
$paddingClass = $padded ? 'p-5' : '';
@endphp

<div {{ $attributes->merge(['class' => "bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-budgie shadow-budgie {$paddingClass}"]) }}>
    {{ $slot }}
</div>
