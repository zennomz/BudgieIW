@props(['label' => null, 'name', 'type' => 'text', 'required' => false])

<div class="space-y-2">
    @if($label)
        <label for="{{ $name }}" class="block text-sm text-budgie-muted">
            {{ $label }}
        </label>
    @endif

    <input
        type="{{ $type }}"
        id="{{ $name }}"
        name="{{ $name }}"
        {{ $required ? 'required' : '' }}
        {{ $attributes->merge(['class' => 'w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-budgie-text placeholder-budgie-muted focus:outline-none focus:ring-2 focus:ring-budgie-accent focus:border-transparent transition-all']) }}
    />
</div>
