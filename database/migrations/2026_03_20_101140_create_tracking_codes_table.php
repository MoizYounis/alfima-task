<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tracking_codes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('script_code');
            $table->boolean('is_external')->default(false);
            $table->enum('placement', ['head', 'body_start', 'body_end'])->default('head');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracking_codes');
    }
};
