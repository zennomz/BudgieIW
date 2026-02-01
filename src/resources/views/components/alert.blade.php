@props(['type' => 'danger'])

@php
$classes = match($type) {
    'danger' => 'bg-budgie-danger/15 border-budgie-danger/30 text-budgie-danger',
    'success' => 'bg-budgie-success/15 border-budgie-success/30 text-budgie-success',
    'warning' => 'bg-budgie-warning/15 border-budgie-warning/30 text-budgie-warning',
    default => 'bg-budgie-danger/15 border-budgie-danger/30 text-budgie-danger',
};
@endphp

<div {{ $attributes->merge(['class' => "px-4 py-3 rounded-lg border {$classes}"]) }}>
    {{ $slot }}
</div>
